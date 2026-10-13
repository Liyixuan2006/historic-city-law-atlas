"use client";

import { useMemo, useState } from "react";
import indexData from "@/data/legislative-index.json";
import englishLaws from "@/data/laws.en.json";
import { LocalizedTree, translateText, type Locale } from "./i18n";

type Entry = (typeof indexData.entries)[number];
type Dimension = (typeof indexData.dimensions)[number];
type SortKey = "rank" | "total" | Dimension["key"];
type LevelFilter = "all" | "prefecture" | "county";
const englishLawTitles = englishLaws.translations as Record<string, { title: string }>;

const scoreBands = [
  { label: "40 分以下", min: 0, max: 40 },
  { label: "40–49.9", min: 40, max: 50 },
  { label: "50–59.9", min: 50, max: 60 },
  { label: "60 分及以上", min: 60, max: 101 },
];

function scoreColor(score: number, max: number) {
  const ratio = score / max;
  if (ratio >= 0.75) return "strong";
  if (ratio >= 0.5) return "mid";
  return "weak";
}

export function LegislativeIndexDashboard({ onOpenLaw, locale }: { onOpenLaw: (lawId: string) => void; locale: Locale }) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<LevelFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [selected, setSelected] = useState<Entry | null>(null);
  const [display, setDisplay] = useState<"ranking" | "matrix">("ranking");
  const entries = indexData.entries as Entry[];
  const dimensions = indexData.dimensions as Dimension[];
  const metadata = indexData.metadata;
  const topEntry = entries.reduce((top, entry) => entry.total > top.total ? entry : top, entries[0]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return entries
      .filter((entry) => level === "all" || (level === "prefecture"
        ? entry.level === "省市级"
        : entry.level === "县级（含县级市）"))
      .filter((entry) => {
        const searchableName = locale === "en" ? englishLawTitles[entry.lawId]?.title ?? translateText(entry.name, locale) : entry.name;
        const searchableJurisdiction = translateText(entry.jurisdiction, locale);
        return !needle || `${entry.name} ${entry.jurisdiction} ${searchableName} ${searchableJurisdiction}`.toLocaleLowerCase().includes(needle);
      })
      .sort((a, b) => {
        if (sortKey === "rank") return a.rank - b.rank;
        if (sortKey === "total") return b.total - a.total;
        const dimension = dimensions.find((item) => item.key === sortKey);
        return dimension ? b.scores[dimension.key] - a.scores[dimension.key] : a.rank - b.rank;
      });
  }, [entries, level, locale, query, sortKey]);

  const scoreBandCounts = scoreBands.map((band) => ({
    ...band,
    count: entries.filter((entry) => entry.total >= band.min && entry.total < band.max).length,
  }));
  const maxBandCount = Math.max(...scoreBandCounts.map((band) => band.count), 1);

  return (
    <LocalizedTree locale={locale}>
    <div className="content index-dashboard">
      <section className="index-hero panel">
        <div>
          <span className="eyebrow">2026 · 立法质量指数</span>
          <h2>把 53 部条例，<br />放在同一把尺上比较。</h2>
          <p>依据现行地方性法规文本，观察保护对象、权责、执行程序、资金权益、活化利用、公众监督与数字治理七个维度。</p>
        </div>
        <aside className="index-hero-note">
          <span>评价边界</span>
          <strong>只评价条例文本的立法质量</strong>
          <p>得分反映条文的明晰度、完整度和可操作性，不代表实际履职或遗产保护成效。</p>
          <small>评价时点　2026 年 8 月 9 日</small>
        </aside>
      </section>

          <section className="index-stat-grid" aria-label="立法指数总体数据">
        <article><span>有效条例样本</span><strong>{metadata.sampleCount}</strong><small>去重并保留现行整合文本</small></article>
        <article><span>平均分</span><strong>{metadata.average.toFixed(1)}</strong><small>满分 100 分</small></article>
        <article><span>中位数</span><strong>{metadata.median.toFixed(1)}</strong><small>样本排序后的中间值</small></article>
        <article><span>最高分</span><strong>{topEntry.total.toFixed(1)}</strong><small>{topEntry.jurisdiction} · {topEntry.name.match(/\d{4}/)?.[0] ?? "现行文本"}</small></article>
      </section>

      <section className="index-overview-grid">
        <article className="panel index-dimension-panel">
          <div className="index-panel-heading"><div><span className="eyebrow">七维评价</span><h3>整体得分结构</h3></div><span className="index-heading-note">平均得分 / 维度满分</span></div>
          <div className="index-dimension-list">
            {dimensions.map((dimension) => (
              <div className="index-dimension" key={dimension.key}>
                <div className="index-dimension-label"><span>{dimension.name}</span><b>{dimension.average.toFixed(1)} <small>/ {dimension.max}</small></b></div>
                <div className="index-track"><i style={{ width: `${(dimension.average / dimension.max) * 100}%` }} /></div>
              </div>
            ))}
          </div>
          <p className="index-footnote">数字治理、资金补偿和公众反馈是样本中相对薄弱的维度。</p>
        </article>

        <article className="panel index-distribution-panel">
          <div className="index-panel-heading"><div><span className="eyebrow">样本分布</span><h3>样本层级与分数分布</h3></div></div>
          <figure className="index-sample-map"><div className="index-map-frame"><img src={`${import.meta.env.BASE_URL}assets/regulation-sample-distribution.png`} alt={locale === "en" ? "Illustrative map showing the geographic distribution of sampled historic city protection regulations" : "历史文化名城保护条例样本在全国的空间分布示意图"} />{locale === "en" && <div className="index-map-english" aria-hidden="true"><strong>Geographic Distribution of Sample Regulations</strong><span className="map-beijing">Beijing</span><span className="map-xian">Xi'an</span><span className="map-nanjing">Nanjing</span><span className="map-kunming">Kunming</span><span className="map-dali">Dali</span><span className="map-guangzhou">Guangzhou</span><i /></div>}</div><figcaption>{locale === "en" ? "Illustrative distribution map prepared by the project team; it is not an administrative boundary map." : "报告自制空间分布示意图，不作为行政区划底图。"}</figcaption></figure>
          <div className="level-comparison">
            <div><span>县级（含县级市）</span><strong>{metadata.countyCount} <small>部</small></strong><i>平均 {metadata.countyAverage.toFixed(1)} 分</i></div>
            <div><span>省市级</span><strong>{metadata.prefectureCount} <small>部</small></strong><i>平均 {metadata.prefectureAverage.toFixed(1)} 分</i></div>
          </div>
          <div className="score-distribution">
            {scoreBandCounts.map((band) => (
              <div className="score-band" key={band.label}>
                <span>{band.label}</span>
                <div className="index-track"><i style={{ width: `${(band.count / maxBandCount) * 100}%` }} /></div>
                <b>{band.count}</b>
              </div>
            ))}
          </div>
          <p className="index-footnote">层级差异主要集中在协同、资金补偿、公众参与和数字治理。</p>
        </article>
      </section>

      <section className="index-results panel">
        <div className="index-results-heading">
          <div><span className="eyebrow">条例比较</span><h3>条例排名与维度比较</h3><p>选择条例查看七维得分，并可跳转到法规目录中的原文。</p></div>
          <div className="index-view-switch" role="group" aria-label="结果展示方式">
            <button className={display === "ranking" ? "active" : ""} onClick={() => setDisplay("ranking")}>排名列表</button>
            <button className={display === "matrix" ? "active" : ""} onClick={() => setDisplay("matrix")}>得分热力图</button>
          </div>
        </div>
        <div className="index-toolbar">
          <label className="search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索条例或地区" aria-label="搜索条例或地区" /></label>
          <label className="select-label">层级<select value={level} onChange={(event) => setLevel(event.target.value as LevelFilter)}><option value="all">全部层级</option><option value="prefecture">省市级</option><option value="county">县级（含县级市）</option></select></label>
          <label className="select-label">排序<select value={sortKey} onChange={(event) => setSortKey(event.target.value as SortKey)}><option value="rank">报告排名</option><option value="total">总分从高到低</option>{dimensions.map((dimension) => <option key={dimension.key} value={dimension.key}>{dimension.name}</option>)}</select></label>
          <span className="index-result-count">{filtered.length}{locale === "en" ? ` / ${metadata.sampleCount} regulations` : ` / ${metadata.sampleCount} 部`}</span>
        </div>

        {display === "ranking" ? (
          <div className="index-ranking-list">
            <div className="index-ranking-row index-ranking-head"><span>排名</span><span>条例与地区</span><span>层级</span><span>总分</span><span>七维得分率</span></div>
            {filtered.map((entry) => (
              <button className="index-ranking-row" key={entry.lawId} onClick={() => setSelected(entry)}>
                <span className="index-rank">{String(entry.rank).padStart(2, "0")}</span>
                <span className="index-law"><strong>{locale === "en" ? englishLawTitles[entry.lawId]?.title ?? translateText(entry.name, locale) : entry.name}</strong><small>{translateText(entry.jurisdiction, locale)}</small></span>
                <span className="index-level">{entry.level}</span>
                <span className="index-total">{entry.total.toFixed(1)}</span>
                <span className="index-mini-bars" aria-label="七维得分率">{dimensions.map((dimension) => <i key={dimension.key} className={scoreColor(entry.scores[dimension.key], dimension.max)} style={{ height: `${Math.max(18, entry.scores[dimension.key] / dimension.max * 100)}%` }} title={`${translateText(dimension.name, locale)}: ${entry.scores[dimension.key]} / ${dimension.max}`} />)}</span>
              </button>
            ))}
            {!filtered.length && <p className="index-empty">没有找到符合条件的条例。</p>}
          </div>
        ) : (
          <div className="index-heatmap-wrap">
            <div className="index-heatmap" role="table" aria-label="53 部条例七维得分热力图">
              <div className="heatmap-row heatmap-header" role="row"><span role="columnheader">排名 / 条例</span>{dimensions.map((dimension) => <span role="columnheader" key={dimension.key}>{dimension.name}<small>/ {dimension.max}</small></span>)}<span role="columnheader">总分</span></div>
              {filtered.map((entry) => (
                <button className="heatmap-row" role="row" key={entry.lawId} onClick={() => setSelected(entry)}>
                  <span className="heatmap-name" role="rowheader"><b>{String(entry.rank).padStart(2, "0")}</b>{locale === "en" ? englishLawTitles[entry.lawId]?.title ?? translateText(entry.name, locale) : entry.name}</span>
                  {dimensions.map((dimension) => <span className={`heat-cell ${scoreColor(entry.scores[dimension.key], dimension.max)}`} role="cell" key={dimension.key}>{entry.scores[dimension.key].toFixed(1)}</span>)}
                  <strong role="cell">{entry.total.toFixed(1)}</strong>
                </button>
              ))}
              {!filtered.length && <p className="index-empty">没有找到符合条件的条例。</p>}
            </div>
            <div className="heatmap-legend"><span><i className="weak" /> 相对较低</span><span><i className="mid" /> 中等</span><span><i className="strong" /> 相对较高</span><small>按各维度满分折算得分率</small></div>
          </div>
        )}
      </section>

      <footer className="index-source-note"><span>数据来源</span><p>项目组《中国历史文化名城保护立法指数报告》附录 A。综合法规、旧版及修改决定的样本处理口径以报告正文为准。报告原始数据与法规库分别维护。</p></footer>

      {selected && <div className="modal-backdrop index-modal-backdrop">
        <button className="modal-dismiss" onClick={() => setSelected(null)} aria-label="关闭条例得分详情" />
        <section className="drawer index-detail-drawer" role="dialog" aria-modal="true" aria-label={locale === "en" ? `${englishLawTitles[selected.lawId]?.title ?? translateText(selected.name, locale)} legislative index details` : `${selected.name}立法指数详情`}>
          <button className="close" onClick={() => setSelected(null)} aria-label="关闭">×</button>
          <span className="eyebrow">RANK {String(selected.rank).padStart(2, "0")} · {selected.level}</span>
          <h2>{locale === "en" ? englishLawTitles[selected.lawId]?.title ?? translateText(selected.name, locale) : selected.name}</h2>
          <p className="index-detail-location">{translateText(selected.jurisdiction, locale)}　·　{locale === "en" ? "Total score" : "总分"} <strong>{selected.total.toFixed(1)} / 100</strong></p>
          <div className="index-detail-dimensions">{dimensions.map((dimension) => {
            const value = selected.scores[dimension.key];
            return <div key={dimension.key}><span>{dimension.name}</span><b>{value.toFixed(1)} <small>/ {dimension.max}</small></b><i className="index-track"><em style={{ width: `${(value / dimension.max) * 100}%` }} /></i></div>;
          })}</div>
          <div className="notice"><strong>评价说明</strong><p>分值用于观察条例文本的规范质量，不代表当地历史文化保护工作的实际成效。</p></div>
          <button className="primary wide" onClick={() => { setSelected(null); onOpenLaw(selected.lawId); }}>查看法规原文</button>
        </section>
      </div>}
    </div>
    </LocalizedTree>
  );
}
