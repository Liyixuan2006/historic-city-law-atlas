import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

export type Locale = "zh" | "en";

// UI wording follows common patterns used by international legal research tools:
// concise navigation labels, explicit search scope, and consistent document terms.
const en: Record<string, string> = {
  "城保法研": "Historic City Law Atlas", "法规与制度证据库": "Laws & Policy Evidence Database",
  "主要导航": "Main navigation", "概览": "Overview", "法规目录": "Laws & Regulations", "保护指数": "Protection Index", "研究成果": "Research", "指标体系": "Codebook",
  "中国历史文化名城保护立法指数": "Legislative Index for Historic and Cultural City Protection in China",
  "2026 · 立法质量指数": "2026 · Legislative Quality Index", "把 53 部条例，": "Comparing 53 regulations", "放在同一把尺上比较。": "on a common scale.",
  "依据现行地方性法规文本，观察保护对象、权责、执行程序、资金权益、活化利用、公众监督与数字治理七个维度。": "The index assesses current local regulations across seven dimensions: protected assets, responsibilities, procedures, funding and rights, adaptive use, public oversight, and digital governance.",
  "评价边界": "Scope", "只评价条例文本的立法质量": "Assesses legislative quality in the text only", "得分反映条文的明晰度、完整度和可操作性，不代表实际履职或遗产保护成效。": "Scores reflect the clarity, completeness, and operability of legal provisions. They do not measure implementation or conservation outcomes.", "评价时点 2026 年 8 月 9 日": "Assessment date · 9 August 2026",
  "立法指数总体数据": "Legislative index summary", "有效条例样本": "Current regulations in the sample", "去重并保留现行整合文本": "Duplicates removed; current consolidated texts retained", "平均分": "Mean score", "满分 100 分": "Out of 100 points", "中位数": "Median", "样本排序后的中间值": "Middle value of the ordered sample", "最高分": "Highest score",
  "七维评价": "Seven dimensions", "整体得分结构": "Overall score profile", "平均得分 / 维度满分": "Mean score / dimension maximum", "保护对象与规范完整性": "Protected Assets and Regulatory Completeness", "责任主体与权责清晰度": "Responsible Authorities and Clarity of Powers", "保护措施与执行程序": "Protection Measures and Procedures", "资金投入与权益补偿": "Funding and Rights Compensation", "保护利用协调与活化传承": "Balancing Protection, Use, and Transmission", "公众参与与监督问责": "Public Participation and Accountability", "数字化治理与动态监测": "Digital Governance and Monitoring", "数字治理、资金补偿和公众反馈是样本中相对薄弱的维度。": "Digital governance, funding and compensation, and public feedback are relative weaknesses across the sample.",
  "样本分布": "Sample distribution", "样本层级与分数分布": "Sample by administrative level and score", "报告自制空间分布示意图，不作为行政区划底图。": "Illustrative distribution map prepared by the project team; it is not an administrative boundary map.", "县级（含县级市）": "County-level (including county-level cities)", "省市级": "Provincial and municipal", "部": "regulations", "平均": "Mean", "分": "points", "40 分以下": "Below 40", "40–49.9": "40–49.9", "50–59.9": "50–59.9", "60 分及以上": "60 and above", "层级差异主要集中在协同、资金补偿、公众参与和数字治理。": "Differences by administrative level are concentrated in coordination, funding and compensation, public participation, and digital governance.",
  "条例比较": "Regulation comparison", "条例排名与维度比较": "Rankings and dimension comparison", "选择条例查看七维得分，并可跳转到法规目录中的原文。": "Select a regulation to review its seven dimension scores and open the source text in the law catalog.", "结果展示方式": "Display mode", "排名列表": "Ranked list", "得分热力图": "Score heatmap", "搜索条例或地区": "Search regulations or jurisdictions", "层级": "Administrative level", "全部层级": "All levels", "排序": "Sort by", "报告排名": "Report ranking", "总分从高到低": "Total score: high to low", "七维得分率": "Seven-dimension score rates", "排名": "Rank", "条例与地区": "Regulation and jurisdiction", "总分": "Total", "没有找到符合条件的条例。": "No regulations match your criteria.", "排名 / 条例": "Rank / regulation", "相对较低": "Relatively low", "中等": "Moderate", "相对较高": "Relatively high", "按各维度满分折算得分率": "Scores shown as a share of each dimension's maximum",
  "数据来源": "Source", "项目组《中国历史文化名城保护立法指数报告》附录 A。综合法规、旧版及修改决定的样本处理口径以报告正文为准。报告原始数据与法规库分别维护。": "Appendix A of the project team's Index Report on Legislation for the Protection of Historic and Cultural Cities in China. See the report for sample rules covering consolidated regulations, superseded versions, and amendment decisions. The report data and law catalog are maintained separately.",
  "关闭条例得分详情": "Close regulation score details", "条例得分详情": "Regulation score details", "关闭": "Close", "53 部条例七维得分热力图": "Score heatmap of 53 regulations across seven dimensions", "评价说明": "Assessment note", "分值用于观察条例文本的规范质量，不代表当地历史文化保护工作的实际成效。": "Scores assess the quality of the regulatory text and do not indicate actual conservation outcomes in the jurisdiction.", "查看法规原文": "View source regulation",
  "数据原则": "Research standard", "所有制度判断必须回链到具体条款。机器初编与人工复核分开标记。": "Every policy finding links to a specific provision. Machine-assisted coding is distinguished from human review.",
  "三明市泰宁": "Taining County, Sanming, Fujian", "云南省大理白族自治州大理": "Dali, Dali Bai Autonomous Prefecture, Yunnan", "凉山彝族自治州会理": "Huili, Liangshan Yi Autonomous Prefecture", "南平市建瓯": "Jian'ou, Nanping, Fujian", "忻州市代县": "Dai County, Xinzhou, Shanxi", "曲靖市会泽": "Huize County, Qujing, Yunnan", "湘西土家族苗族自治州凤凰": "Fenghuang, Xiangxi Tujia and Miao Autonomous Prefecture", "玉溪市通海县": "Tonghai County, Yuxi, Yunnan", "邵阳市武冈": "Wugang, Shaoyang, Hunan", "龙岩市长汀": "Changting County, Longyan, Fujian", "黔东南苗族侗族自治州镇远": "Zhenyuan County, Qiandongnan Miao and Dong Autonomous Prefecture",
  "研究原型 · 内部审核版": "Research prototype · Internal review",
  "历史文化名城保护法规数据库": "Historic City Protection Laws Database", "法规目录与版本管理": "Laws & Version History", "从法规证据到制度方案": "From Legal Evidence to Policy Design", "十四项制度指标编码手册": "Codebook: 14 Policy Indicators",
  "数据目录已建立": "Catalog updated", "从文件堆栈到可验证的制度数据": "From document collections to verifiable legal data",
  "让每一个结论，": "Every finding links back", "都能回到一条法规原文。": "to the law.",
  "以法规全文和条文证据为底座，连接指标编码、立法质量评价、地方调研与制度设计，呈现项目从资料加工到成果转化的完整路径。": "Built on full-text laws and provision-level evidence, this atlas connects policy coding, legislative quality assessment, field research, and policy design—from source materials to practical recommendations.",
  "浏览法规目录": "Browse laws", "查看研究成果": "Explore research", "加工流水线": "Research workflow", "第 1 / 4 阶段": "Stage 1 of 4",
  "法规目录建库": "Catalog laws", "59份文件已登记": "59 documents catalogued", "正文与条文抽取": "Extract text and provisions", "条记录已结构化": "provisions structured", "十四指标机器初编": "Code 14 indicators", "条证据已回链": "evidence items linked", "双人复核与发布": "Dual review and publication", "机器初编待人工确认": "Machine-assisted coding pending human review",
  "数据库统计": "Database statistics", "法规文件": "Documents", "部条例 ·": "regulations ·", "份修改决定": "amendment decisions", "地域单元": "Jurisdictions", "按法规标题自动识别": "Identified from document titles", "条文记录": "Provisions", "含4份修改决定的全文记录": "Including full text of 4 amendment decisions", "证据回链": "Evidence links", "项机器初编": "machine-assisted coding entries",
  "一条清晰的成果主线": "A clear path from evidence to outcomes", "网站不把附件平行堆放，而是按照研究过程将每项成果连接起来。": "Research outputs are connected by their role in the project, rather than listed as separate attachments.",
  "法规证据": "Legal evidence", "全文、版本与条文回链": "Full text, versions, and provision links", "结构化编码": "Structured coding", "14项核心指标快速检视": "Review 14 core indicators", "质量评价": "Quality assessment", "40项指标与全国试测": "40 indicators and a national pilot", "制度转化": "Policy design", "实施细则与示范条款": "Implementation rules and model provisions",
  "CATALOG": "CATALOG", "最近入库法规": "Recently added", "查看全部": "View all", "CODEBOOK": "CODEBOOK", "制度分析框架": "Policy analysis framework", "完整手册": "Full codebook",
  "搜索法规名称、城市或北大法宝编号": "Search by title, jurisdiction, or PKULaw ID", "搜索法规": "Search laws", "类型": "Document type", "全部文件": "All documents", "保护条例": "Protection regulation", "修改决定": "Amendment decision", "显示": "Showing",
  "法规与地域": "Title & jurisdiction", "版本": "Version", "条文": "Provisions", "加工状态": "Processing status", "修订": "revision", "修正": "amendment", "现有版本": "current version", "已抽取": "Extracted", "需校对": "Needs review", "待重新读取": "Retry extraction", "待处理": "Pending",
  "研究成果不只是附件汇集，": "Research outputs are more than a set of attachments;", "更是研究过程的完整呈现。": "they document the full research process.",
  "数据库回答“法规写了什么”，评价指数识别“制度强弱在哪里”，地方调研检验“运行中发生了什么”，实施细则与示范条款再把发现转化为可执行方案。": "The database shows what the laws say; the index identifies institutional strengths and gaps; field research examines how the rules work in practice; and implementation guidance turns findings into actionable proposals.",
  "研究成果页内导航": "Research section navigation", "评价框架": "Assessment framework", "全国发现": "National findings", "地方调研": "Field research",
  "附件一": "Appendix 1", "历史文化名城保护指数 · 试测版 1.2": "Historic City Protection Index · Pilot v1.2", "在网站的14项核心制度编码之上，建立适合深度评价的40项三级指标，并把立法质量与实施效能分开测量。": "Building on the atlas's 14 core policy indicators, the index uses 40 detailed measures and assesses legislative quality separately from implementation effectiveness.",
  "数据库快速编码": "Database coding", "用于大样本检索、横向比较和条文证据定位。": "Designed for large-sample searches, comparisons, and provision-level evidence retrieval.", "立法质量子指数": "Legislative quality sub-index", "分 · 70%": "points · 70%", "七个维度、40项三级指标，采用A—E等级评分。": "Seven dimensions and 40 detailed indicators, scored on an A–E scale.", "实施效能子指数": "Implementation effectiveness sub-index", "分 · 30%": "points · 30%", "通过访谈、现场观察和多级证据补足“纸面规则”之外的运行表现。": "Interviews, site observations, and tiered evidence capture how rules operate beyond the text.",
  "质量控制": "Quality control", "证据分为 I—IV 级；区分缺失与不适用；实行双人编码，并以加权 Kappa / ICC 检验一致性，开展权重 ±20% 敏感性分析。": "Evidence is graded I–IV; missing data is distinguished from non-applicability; coding is independently double-coded and assessed with weighted Kappa / ICC; and weights are tested for sensitivity at ±20%.",
  "附件二": "Appendix 2", "中国历史文化名城保护立法指数报告": "Index Report on Legislation for the Protection of Historic and Cultural Cities in China", "对现有法规进行去重、校核与试测，呈现立法质量的总体水平、结构差异与共同短板。": "Deduplicates and reviews the available regulations, then pilots the index to assess overall legislative quality, structural differences, and shared gaps.",
  "有效现行文本": "Effective texts", "平均得分": "Mean score", "中位数": "Median", "试测样本含11部县域法规与42部省、市法规。县域样本平均46.1分，省、市样本平均53.3分。": "The pilot covers 11 county-level and 42 provincial- or municipal-level regulations. The county-level mean is 46.1; the provincial and municipal mean is 53.3.",
  "共同薄弱环节": "Common gaps", "资金与补偿、公众意见反馈、数字治理。报告据此提出权利保障、协同流程、风险闭环、参与反馈、数字治理和周期评估六类改进方向。": "Funding and compensation, public feedback, and digital governance remain weak. The report proposes six areas for improvement: rights protection, coordination, risk management, public participation, digital governance, and periodic assessment.",
  "附件三": "Appendix 3", "泰宁：从法规接口到执行闭环": "Taining: From Legal Duties to an Implementation Loop", "以《三明市泰宁历史文化名城保护条例》为基础，将“原则上有规定”进一步拆解为责任人、办理时限、执行标准、留痕证据与逾期升级机制。": "Using the Taining regulation as a foundation, this section translates general legal duties into assigned responsibilities, deadlines, operational standards, records, and escalation procedures.",
  "协同工单": "Coordination workflow", "把部门职责转化为牵头、配合、时限与反馈节点": "Turn agency responsibilities into lead roles, supporting roles, deadlines, and feedback steps", "修缮与补助": "Repairs and grants", "衔接修缮程序、技术服务、资金补助与权益保障": "Connect repair procedures, technical services, financial support, and rights protection", "业态清单": "Business-use list", "以绿、黄、红三级清单引导兼容经营与负面约束": "Use green, amber, and red categories to guide compatible uses and restrict harmful ones", "一处一档一码": "One site, one file, one code", "关联对象档案、修缮记录、巡查信息与公众查询": "Link site records, repair history, inspections, and public access", "风险闭环": "Closed-loop risk management", "形成发现、分级、处置、复核和销号的巡查链条": "Connect detection, classification, response, review, and closure", "居民参与": "Resident participation", "嵌入意见收集、办理反馈、绩效公开与社会监督": "Build in public comments, responses, performance reporting, and oversight",
  "成果定位": "Status of this material", "实施细则及配套材料为项目研究稿，建议以县级政府规范性文件等适当形式承接；不得脱离上位法新增行政许可、处罚或减损权利。": "The implementation rules and supporting materials are research drafts. Any adoption should use an appropriate county-level instrument and must not create licensing or penalty powers, or restrict rights, beyond the authority of superior law.",
  "附件四": "Appendix 4", "徐州、成都与淄博·临淄调研报告": "Field Reports: Xuzhou, Chengdu, and Linzi, Zibo", "以地级市综合保护、超大城市系统治理和地下大遗址型县区为三类样本，检验法规制度在协同、数字化、资金、活化利用与权益保障中的实际运行。": "Three case studies examine integrated municipal conservation, governance in a megacity, and an archaeological-site county district, focusing on coordination, digital tools, funding, adaptive reuse, and rights protection.",
  "阅读调研报告": "Read field report", "样本定位": "Case profile", "材料与方法": "Sources and methods", "核心制度与实践": "Key institutions and practices", "观察到的难点": "Challenges observed", "对县级立法的启示": "Implications for county-level legislation", "研究说明": "Research note", "本页对项目调研成果进行结构化整理，保留报告的样本边界与研究方法，不将调研材料表述为现行法规结论。": "This structured summary preserves each study's scope and methods. Fieldwork findings are not presented as statements of current law.", "返回研究成果": "Back to research",
  "地级市综合保护样本": "Prefecture-level integrated conservation", "首批国家历史文化名城样本": "One of China's first designated historic cities", "地下大遗址型县区样本": "County district with a major archaeological site",
  "条例全文、配套文件与公开资料分析，结合当地工作人员访谈": "Analysis of the regulation, supporting documents, and public materials, supplemented by interviews with local officials", "政府公开文件、工作报告与权威报道研究，结合四川大学博物馆实地考察": "Review of government documents, work reports, and authoritative coverage, plus a site visit to the Sichuan University Museum", "以淄博市临淄区为对象，对保护规划、制度文件与实践资料进行比较研究": "Comparative study of conservation plans, policy documents, and implementation materials in Linzi District, Zibo",
  "附件五": "Appendix 5", "县域历史文化名城保护示范条款库": "Model Provisions for County-Level Historic City Protection", "围绕县域治理特点整理可组合、可检索的制度模块，为地方立法论证提供条款素材，而不是将研究稿冒充现行法规。": "Modular provisions tailored to county-level governance are provided as drafting resources for local legislative analysis. They are research proposals, not current law.", "使用说明": "How to use", "本成果属于研究建议稿。具体采用时，应结合地方立法权限、上位法依据、行政资源和本地保护对象实际进行逐条论证。": "This is a research proposal. Each provision should be assessed against local legislative authority, superior law, administrative capacity, and local conservation needs before use.",
  "保护对象体系": "Protected assets", "修缮与权利平衡": "Repairs and rights", "传统村落与原住居民": "Traditional villages and residents", "活化利用与业态规制": "Adaptive reuse and business regulation", "数字建档与风险监测": "Digital records and risk monitoring", "公众参与与监督问责": "Public participation and accountability",
  "CODING STANDARD · V0.1": "CODING STANDARD · V0.1", "统一定义，分级判断，证据优先。": "Consistent definitions. Tiered assessment. Evidence first.", "每项指标记录 presence、strength、article_ref、evidence_text、coding_note、confidence 与 review_status。点击指标查看完整的 0—3 级判定标准。": "Each indicator records presence, strength, article reference, evidence text, coding note, confidence, and review status. Select an indicator to view its full 0–3 rubric.",
  "份检出 ·": "of documents ·", "条证据": "evidence items", "查看量表 →": "View rubric →", "0—3级判定量表": "0–3 assessment rubric", "未建立": "Not established", "原则规定": "General principle", "程序明确": "Defined procedure", "机制完整": "Complete mechanism", "编码要求": "Coding requirements", "至少保存一条直接相关的法规原文；若多个条文共同构成制度，分别保存并说明其关系。": "Save at least one directly relevant legal provision. If several provisions form a policy mechanism, record each and explain how they relate.",
  "地域": "Jurisdiction", "文件类型": "Document type", "条文数量": "Number of provisions", "检出指标": "Indicators detected", "FULL TEXT": "FULL TEXT", "法规全文": "Full text", "共": "Total", "条": "provisions", "章节目录": "Chapter index", "来源文件": "Source file", "北大法宝 /": "PKULaw /", "文本说明": "Text note", "本页展示数据库从来源文件中结构化提取的全部条文。研究引用前请与正式公布文本复核。": "This page displays provisions structured from the source file. Verify against the officially promulgated text before citing.", "返回目录": "Back to catalog", "关闭法规全文": "Close full text", "关闭": "Close", "LAW RECORD ·": "LAW RECORD ·", "关闭指标编码标准": "Close indicator rubric", "指标编码标准": "Indicator rubric", "关闭调研报告": "Close field report",
  "已登记": "catalogued", "份检出": "documents", " 条": " provisions", " 条证据": " evidence items", " 条证据已回链": " evidence items linked", "条记录": "provision records", "查看量表": "View rubric", "法律法规": "Laws & Regulations", "浏览保护指数": "Browse the Protection Index", "53部条例立法质量比较": "Legislative quality comparison of 53 regulations", "进入保护指数看板，查看 53 部条例的排名与维度得分": "Open the Protection Index to view rankings and dimension scores for 53 regulations", "立法质量指数": "Legislative Quality Index", "查看保护指数详情 →": "View Protection Index details →", "Switch language to Chinese": "Switch language to Chinese", "调研报告": "Field Report",
  "切换到English": "Switch to English", "历史文化名城": "historic and cultural city", "总则": "General Provisions", "保护对象": "Protected Assets", "保护范围": "Protected Areas", "保护规划": "Conservation Planning", "保护措施": "Conservation Measures", "保护": "Conservation", "规划": "Planning", "管理": "Administration", "利用": "Use", "修缮": "Repairs", "法律责任": "Legal Liability", "附则": "Supplementary Provisions", "监督检查": "Inspection and Oversight", "监督": "Oversight", "名录": "Inventory", "历史文化街区": "historic district", "历史建筑": "historic building", "传统村落": "traditional village", "文物": "cultural relics", "非物质文化遗产": "intangible cultural heritage", "资金保障": "Funding", "公众参与": "Public Participation", "奖励与处罚": "Incentives and Penalties",
};

Object.assign(en, {
  "保护对象与规范完备": "Protected assets and regulatory completeness", "责任主体与职权配置": "Responsible bodies and allocation of powers", "保护措施与程序控制": "Conservation measures and procedural safeguards", "资金保障与权益补偿": "Funding and compensation", "合理利用与活化传承": "Compatible use and living heritage", "公众参与与监督问责": "Public participation and accountability", "数字治理与动态监测": "Digital governance and ongoing monitoring",
  "保护对象覆盖度": "Coverage of protected assets", "保护体系": "Protection framework", "对象覆盖": "Asset coverage", "法规是否形成从名城整体到街区、建筑、环境要素与非物质文化遗产的分层保护对象体系。": "Does the regulation establish layered protection for the historic city as a whole, historic districts, buildings, environmental features, and intangible cultural heritage?", "未列明保护对象": "No protected assets identified", "仅规定名城或少数对象": "Only the city or a few assets are covered", "覆盖多类物质遗产": "Multiple types of tangible heritage are covered", "形成物质与非物质遗产的完整分层体系": "A complete, layered framework covers tangible and intangible heritage",
  "保护范围与保护边界": "Protected areas and boundaries", "范围边界": "Areas and boundaries", "是否明确保护范围、核心区与建设控制地带，并规定边界公布、标识和调整程序。": "Are protected areas, core areas, and construction control zones defined, with procedures for publication, marking, and adjustment?", "无范围规定": "No area requirements", "笼统提及保护范围": "Protected areas mentioned in general terms", "要求划定范围或控制地带": "Requires protected areas or control zones to be designated", "边界、图则、公布和调整程序均明确": "Boundaries, maps, publication, and adjustment procedures are specified",
  "责任主体明确度": "Clarity of assigned responsibilities", "治理机制": "Governance", "主体责任": "Assigned responsibilities", "政府、主管部门、产权人、使用人及其他主体的职责是否具体且可归责。": "Are the responsibilities of government, competent authorities, owners, users, and other parties specific and accountable?", "无明确主体": "No responsible party identified", "仅笼统规定政府负责": "General responsibility assigned to the government", "明确主管部门及部分主体": "Competent authorities and some parties are identified", "多主体职责、权限和履责要求完整": "Responsibilities, powers, and duties are defined for all key parties",
  "部门协同机制": "Inter-agency coordination", "部门协同": "Agency coordination", "是否建立跨部门议事协调、信息共享、联合执法或争议处理机制。": "Are there mechanisms for inter-agency coordination, information sharing, joint enforcement, or dispute resolution?", "无协同规定": "No coordination mechanism", "原则性要求配合": "General duty to cooperate", "明确牵头与协作部门": "Lead and supporting agencies are identified", "具备常态化议事、共享或联合执法机制": "Regular coordination, information sharing, or joint enforcement is established",
  "保护规划制度": "Conservation planning", "规划管控": "Planning and controls", "保护规划": "Conservation plan", "保护规划的编制、审批、衔接、公开、实施评估与修改程序是否完整。": "Are procedures for preparing, approving, coordinating, publishing, evaluating, and revising conservation plans complete?", "无规划制度": "No planning framework", "仅要求编制规划": "Requires a plan to be prepared", "规定编制与审批程序": "Preparation and approval procedures are specified", "覆盖公开、实施、评估和修改全周期": "The full cycle covers publication, implementation, evaluation, and revision",
  "预先保护制度": "Provisional protection", "预先保护": "Provisional protection", "对尚未完成认定但具有保护价值的对象，是否可以先行登记、公告并采取临时措施。": "Can assets with heritage value be registered, announced, and protected on an interim basis before formal designation?", "无预先保护": "No provisional protection", "仅有原则性保护表述": "Only a general statement of protection", "规定候选对象或临时措施": "Candidate assets or interim measures are provided for", "触发、期限、措施、解除及补偿机制完整": "Triggers, duration, measures, termination, and compensation are defined",
  "修缮审批程序": "Repair approval procedures", "实施管理": "Implementation", "修缮审批": "Repair approvals", "修缮、改建、迁移、拆除等活动是否具有分级分类审批及技术审查程序。": "Are repairs, alterations, relocation, and demolition subject to tiered approvals and technical review?", "无审批规定": "No approval requirements", "原则性要求批准": "General requirement for approval", "明确申请与审批机关": "Application steps and approving authorities are identified", "分类程序、材料、技术审查和监督验收完整": "Procedures, materials, technical review, oversight, and inspection are specified by activity type",
  "资金来源": "Funding sources", "保障激励": "Funding and incentives", "保护资金": "Conservation funding", "财政投入、专项资金、社会资本、捐赠及资金监管安排是否多元和稳定。": "Are public funding, dedicated funds, private investment, donations, and financial oversight diverse and stable?", "无资金规定": "No funding provisions", "仅原则性财政保障": "General commitment to public funding", "明确专项资金或多元来源": "Dedicated funds or multiple sources are identified", "来源稳定且预算、使用、监督机制完整": "Stable funding is supported by complete budgeting, use, and oversight mechanisms",
  "征收补偿与利益激励": "Compensation and incentives", "补偿激励": "Compensation and incentives", "征收补偿、产权置换、税费优惠、容积率转移、修缮补助等利益平衡工具是否充分。": "Are tools such as expropriation compensation, property exchange, tax incentives, transfer of development rights, and repair grants sufficient?", "无补偿激励": "No compensation or incentives", "仅援引一般补偿": "Only general compensation rules are referenced", "规定补助或优惠工具": "Grants or incentives are provided", "形成多元补偿、激励与救济机制": "A range of compensation, incentives, and remedies is available",
  "原住民参与": "Participation by long-term residents", "公众权益": "Public rights", "居民参与": "Resident participation", "原住居民是否参与规划、更新、经营和监督，居住权与社区延续是否获得保障。": "Do long-term residents participate in planning, renewal, business use, and oversight, with safeguards for residence and community continuity?", "无居民参与": "No resident participation", "原则性听取意见": "General commitment to hear public views", "规定参与程序或权益保障": "Participation procedures or rights safeguards are specified", "参与、反馈、社区延续和利益分享完整": "Participation, feedback, community continuity, and benefit sharing are addressed",
  "商业业态准入": "Business-use requirements", "业态准入": "Business uses", "历史街区内业态是否设置准入、负面清单、规模控制和动态退出规则。": "Are business uses in historic districts governed by entry criteria, negative lists, scale limits, and exit rules?", "无业态规则": "No rules on business uses", "原则性引导": "General guidance only", "规定限制或鼓励类型": "Restricted or encouraged uses are identified", "准入清单、规模控制、评估退出机制完整": "Entry lists, scale limits, evaluation, and exit mechanisms are specified",
  "数字化建档与监测": "Digital records and monitoring", "技术支撑": "Technical support", "数字监测": "Digital monitoring", "是否建立数字档案、数据库、动态监测、风险预警及数据更新制度。": "Are digital records, databases, ongoing monitoring, risk alerts, and data updates established?", "无数字化规定": "No digital provisions", "仅要求建立档案": "Requires records to be created", "明确数字建档或动态监测": "Digital records or ongoing monitoring are specified", "数据库、监测、预警、共享和更新完整": "Databases, monitoring, alerts, sharing, and updates are addressed",
  "社会监督": "Public oversight", "信息公开、举报投诉、公众监督、专家咨询和回应机制是否明确。": "Are disclosure, complaints, public oversight, expert advice, and response mechanisms specified?", "无监督渠道": "No oversight channels", "原则性鼓励监督": "General encouragement of oversight", "明确公开或举报渠道": "Disclosure or reporting channels are identified", "公开、举报、处理反馈和专家监督完整": "Disclosure, reporting, follow-up, feedback, and expert oversight are provided",
  "法律责任和处罚强度": "Liability and penalties", "责任追究": "Accountability", "责任处罚": "Liability and penalties", "违法行为、责任主体、处罚种类、罚款幅度、修复责任及公职人员责任是否匹配。": "Are prohibited conduct, liable parties, penalties, fine ranges, restoration duties, and official accountability appropriately defined?", "无专门责任": "No specific liability provisions", "主要援引上位法": "Primarily refers to superior law", "规定具体违法行为和处罚": "Specific violations and penalties are provided", "处罚覆盖完整、幅度明确并含修复与履职责任": "Penalties are comprehensive, ranges are clear, and restoration and official duties are addressed",
  "数据原则": "Research standard",
  "徐州": "Xuzhou", "成都": "Chengdu", "淄博·临淄": "Linzi, Zibo", "徐": "X", "成": "C", "淄": "L",
  "条例全文、配套文件与公开资料分析，结合当地工作人员访谈": "Analysis of the regulation, supporting documents, and public materials, supplemented by interviews with local officials",
  "徐州以全区域、全要素保护为基础，将历史文化街区、名镇名村、运河遗产、地下文物、红色资源、农业与水利遗产等纳入统一名录，并通过预先保护、部门协同、渐进式微改造和数字化平台推动制度落地。": "Xuzhou takes an area-wide, integrated approach. It brings historic districts, towns and villages, canal heritage, archaeological sites, revolutionary heritage, and agricultural and water-management heritage into a unified inventory. Provisional protection, inter-agency coordination, incremental renewal, and digital platforms support implementation.",
  "建立保护名录与分布图动态调整机制，并对尚未入册但具有价值的资源实施预先保护。": "Maintain and update a conservation inventory and map, and provide provisional protection for valuable assets not yet formally listed.", "形成市级统筹、部门协同、属地落实的工作格局，住建、文旅文物、自然资源等部门分工衔接。": "Coordinate conservation at the municipal level, with agencies and local authorities working together across housing, culture and heritage, and natural resources.", "以“彭城七里”为核心推进微更新，串联黄楼、文庙、回龙窝、户部山等历史节点。": "Use Pengcheng Qili as the focus of incremental renewal, linking historic sites such as Huanglou, the Confucian Temple, Huilongwo, and Hubushan.", "建设古城数字图谱、三维重建与数字体验场景，为档案管理、隐患台账和规划审批提供支撑。": "Develop a digital atlas, 3D reconstructions, and digital visitor experiences to support records management, risk registers, and planning approvals.",
  "偏远点位巡查频次和基层专业能力不足，部分文物本体仍面临积水、边坡与安防等问题。": "Remote sites may not be inspected often enough, and local specialist capacity is limited. Some heritage structures still face drainage, slope-stability, and security risks.", "预先保护的认定时限、产权人沟通及配套细则仍需完善，部门数据标准与共享机制尚未完全统一。": "Time limits for provisional designation, communication with owners, and supporting rules need improvement. Agency data standards and sharing arrangements are not yet fully aligned.", "修缮成本、审批流程、基础设施和复杂产权关系，持续影响居民与经营者参与。": "Repair costs, approval processes, infrastructure, and complex ownership arrangements continue to affect participation by residents and businesses.", "保护范围全面覆盖与保护对象精准认定应同步推进。": "Expand coverage while identifying protected assets precisely.", "明确部门职责的同时，需要把协同机制转化为稳定流程。": "Translate clearly assigned agency duties into stable coordination procedures.", "刚性保护底线应为适度利用、民生改善和渐进更新保留空间。": "Firm conservation safeguards should leave room for compatible use, better living conditions, and incremental renewal.",
  "政府公开文件、工作报告与权威报道研究，结合四川大学博物馆实地考察": "Review of public-sector documents, work reports, and authoritative coverage, supplemented by a visit to the Sichuan University Museum",
  "成都的保护实践呈现法规体系、数字治理、跨部门协作、专业力量、资金激励与活化利用相互支撑的特征，为县级名城破解人手、资金和协同不足提供了可拆解的制度参照。": "In Chengdu, legislation, digital governance, inter-agency coordination, specialist expertise, funding incentives, and adaptive reuse reinforce one another. These practices offer county-level cities practical options for addressing gaps in staffing, funding, and coordination.", "构建“文物一张图”、安全监测预警、历史建筑数字档案与“锦点”平台等多层次数字体系。": "Build a layered digital system that includes a unified heritage map, safety alerts, digital records for historic buildings, and the Jindian platform.", "通过法规分工、区级联合巡查和街道—社区—商居联盟，形成跨部门与基层协同网络。": "Create cross-agency and community coordination through statutory role allocation, joint district inspections, and street-, community-, and business-resident partnerships.", "引入高校开展测绘建档、条例论证、文物普查和公众教育，补充专业能力。": "Engage universities in surveying, records creation, legislative analysis, heritage surveys, and public education to strengthen specialist capacity.", "以财政预算、专项资金、容积率奖励、修缮奖补和文物保险形成多元保障。": "Combine budget appropriations, dedicated funds, floor-area incentives, repair grants, and heritage insurance.", "少城、祠堂街与城厢古城以空间管控、业态引导和原住民参与探索活化利用。": "Adaptive reuse in Shaocheng, Citang Street, and Chengxiang Ancient City combines spatial controls, business-use guidance, and resident participation.", "县级样本普遍存在数字平台、人力配置与常态化协同能力不足的问题。": "County-level cases often lack digital platforms, sufficient staffing, and sustained coordination capacity.", "资金条款若只作原则规定，难以形成稳定、可执行的修缮补助和社会激励。": "General funding clauses alone rarely produce stable, workable repair grants or community incentives.", "业态准入需要同时避免过度商业化与简单禁止，兼顾社区生活延续。": "Business-use rules should avoid both over-commercialization and blanket bans, while supporting continuing community life.", "县级立法宜明确数字档案库、监测预警平台及其更新责任。": "County-level legislation should specify digital archives, monitoring and alert platforms, and responsibility for keeping them current.", "通过常态化联合巡查和基层协同机制解决多头管理与职责交叉。": "Use regular joint inspections and local coordination to address fragmented management and overlapping responsibilities.", "以规划刚性管控配合业态柔性引导，实现保护、利用与民生改善的平衡。": "Balance conservation, use, and residents' needs through firm planning controls and flexible guidance on business activities.",
  "以淄博市临淄区为对象，对保护规划、制度文件与实践资料进行比较研究": "A comparative study of conservation plans, policy documents, and implementation materials in Linzi District, Zibo",
  "临淄区以齐国故城为核心，形成地下大遗址、历史街区、工业遗产与非遗并存的复合体系。其“先考古、后出让”、刚性财政、全域数字监测和司法协同具有鲜明特色，但区级专项条例缺失仍是制度刚性的核心短板。": "Centered on the ancient Qi capital, Linzi combines a major archaeological site, historic districts, industrial heritage, and intangible heritage. Its distinctive practices include archaeological surveys before land transfer, dedicated public funding, area-wide digital monitoring, and judicial coordination. The absence of a district-level conservation regulation remains a key gap.", "建立全域—历史城区—历史文化街区—单体遗产四层空间体系，并以城市紫线实施刚性管控。": "Establish four spatial tiers—from the whole district to the historic urban area, historic districts, and individual heritage assets—and enforce them through designated conservation boundaries.", "在建设用地出让前完成考古勘探，按风险等级差异化管理，发现遗存后采取避让、置换或原址保护。": "Complete archaeological surveys before transferring development land, apply controls by risk level, and respond to discoveries through avoidance, land exchange, or in-situ conservation.", "设置年度专项资金并拓展补助、捐赠、罚没返还和文创反哺等来源。": "Provide annual dedicated funding, supplemented by grants, donations, returned proceeds from penalties, and cultural-product revenue.", "对重点遗址实施三维扫描、BIM建模和传感监测，配套专职巡查队与网格管理。": "Use 3D scanning, BIM models, and sensor monitoring at key sites, supported by dedicated inspection teams and grid-based management.", "通过公安驻队、联席会议、司法保护令、公益诉讼和有奖举报构成协同保护链条。": "Coordinate protection through on-site police teams, joint meetings, judicial protection orders, public-interest litigation, and rewards for reporting violations.", "现有成熟机制主要依靠规划和行政文件，缺少区级地方性法规固化。": "Existing mechanisms rely mainly on plans and administrative documents and have not been secured in district-level local legislation.", "地下遗址与城市开发冲突时，法定复核、土地置换和补偿程序仍不完整。": "When archaeological sites conflict with urban development, statutory review, land exchange, and compensation procedures remain incomplete.", "原住民修缮补贴、收益分配、社区听证以及齐文化特色业态扶持缺少固定标准。": "There are no consistent standards for resident repair grants, benefit sharing, community hearings, or support for businesses reflecting Qi culture.", "数字化运维、专业人才和监测经费仍依赖年度安排，长效性不足。": "Digital operations, specialist staffing, and monitoring budgets depend on annual arrangements, limiting long-term continuity.", "应区分地下大遗址型与地上活态古城型名城，设置差异化保护、开发和补偿规则。": "Distinguish cities centered on major underground archaeological sites from living historic cities, and tailor conservation, development, and compensation rules accordingly.", "可将考古前置、量化财政、数字监管、司法协同和紫线管控逐步上升为稳定制度。": "Make pre-development archaeology, predictable funding, digital oversight, judicial coordination, and conservation boundaries part of stable institutional arrangements.", "泰宁等县域可借鉴其建设前置调查和复合遗产分类保护，同时补强原住民权益。": "County-level cities such as Taining can adapt pre-development surveys and protection by heritage type while strengthening residents' rights.",
  "第": "No.", "正文": "Main Text", "本次工作区": "Current workspace", "第{index}": "{index}",
  "简体中文": "Simplified Chinese",
  "北京历史文化名城保护条例(2021)": "Measures of Beijing Municipality for the Protection of the Historical and Cultural Landmark of Beijing (2021)",
  "朝阳市历史文化名城保护条例": "Regulations of Chaoyang City on the Protection of Its Historic and Cultural City",
  "岳阳市人民代表大会常务委员会关于修改《岳阳历史文化名城保护条例》等地方性法规的决定": "Decision of the Standing Committee of the Yueyang Municipal People's Congress on Amending the Historic City Protection Regulations and Other Local Regulations",
  "历史文化名城保护规划": "Conservation Planning for the Historic and Cultural City", "文物、历史建筑和历史遗址（迹）的保护": "Protection of Cultural Relics, Historic Buildings, and Historic Sites and Remains", "非物质文化遗产保护": "Protection of Intangible Cultural Heritage",
  "保护内容": "Matters to Be Protected",
  "历史文化风貌保护区和 历史文化街区、村镇的保护": "Historic-Character Conservation Areas and Historic Districts, Towns, and Villages",
  "保护对象与保护名录": "Protected Assets and the Protection Register", "传承利用": "Continuity and Use",
  "对象覆盖 · 范围边界": "Asset coverage · Boundaries", "主体责任 · 部门协同": "Assigned responsibilities · Inter-agency coordination", "保护规划 · 预先保护": "Conservation planning · Provisional protection", "修缮审批 · 业态准入": "Repair approvals · Business-use requirements", "保护资金 · 补偿激励": "Conservation funding · Compensation and incentives", "居民参与 · 社会监督": "Resident participation · Public oversight",
});

const cities: Record<string, string> = {
  朝阳: "Chaoyang", 广州: "Guangzhou", 海口: "Haikou", 衡阳: "Hengyang", 淮安: "Huai'an", 南平: "Nanping", 建瓯: "Jian'ou", 莆田: "Putian", 泰宁: "Taining", 三明: "Sanming", 厦门: "Xiamen", 邵阳: "Shaoyang", 武冈: "Wugang", 潍坊: "Weifang", 西安: "Xi'an", 邢台: "Xingtai", 徐州: "Xuzhou", 玉溪: "Yuxi", 通海: "Tonghai", 岳阳: "Yueyang", 长春: "Changchun", 遵义: "Zunyi", 保定: "Baoding", 北京: "Beijing", 承德: "Chengde", 滁州: "Chuzhou", 大连: "Dalian", 福州: "Fuzhou", 杭州: "Hangzhou", 辽阳: "Liaoyang", 柳州: "Liuzhou", 龙岩: "Longyan", 长汀: "Changting", 洛阳: "Luoyang", 泉州: "Quanzhou", 太原: "Taiyuan", 忻州: "Xinzhou", 代县: "Dai County", 银川: "Yinchuan", 自贡: "Zigong", 亳州: "Bozhou", 常州: "Changzhou", 潮州: "Chaozhou", 哈尔滨: "Harbin", 济南: "Jinan", 昆明: "Kunming", 南昌: "Nanchang", 曲靖: "Qujing", 会泽: "Huize", 苏州: "Suzhou", 镇江: "Zhenjiang", 河南: "Henan", 南京: "Nanjing", 沈阳: "Shenyang", 长沙: "Changsha", 凉山: "Liangshan", 会理: "Huili", 黔东南: "Qiandongnan", 镇远: "Zhenyuan", 湘西: "Xiangxi", 凤凰: "Fenghuang", 云南: "Yunnan", 大理: "Dali", 肇庆: "Zhaoqing", 成都: "Chengdu", 临淄: "Linzi", 淄博: "Zibo",
};

function toArabicNumeral(value: string) {
  if (/^\d+$/.test(value)) return value;
  const digits: Record<string, number> = { 零: 0, 〇: 0, 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
  let total = 0; let section = 0; let number = 0;
  for (const char of value) {
    if (char in digits) number = digits[char];
    else if (char === "十") { section += (number || 1) * 10; number = 0; }
    else if (char === "百") { section += (number || 1) * 100; number = 0; }
  }
  total += section + number;
  return String(total || value);
}

function translateSpecial(value: string) {
  const fieldReport = value.match(/^(.*)调研报告$/);
  if (fieldReport) {
    const city = Object.keys(cities).sort((a, b) => b.length - a.length).find((name) => fieldReport[1].includes(name));
    if (city) return `${fieldReport[1].replace(city, cities[city])} Field Report`;
  }
  const chapter = value.match(/^第([一二三四五六七八九十百〇零两\d]+)章[　\s]*(.*)$/);
  if (chapter) {
    const title = chapter[2].trim().replace(/\s+/g, " ");
    const compactTitle = title.replace(/\s/g, "");
    const mappedTitle = Object.entries(chapterTitleTranslations).find(([key]) => key.replace(/\s/g, "") === compactTitle)?.[1];
    return `Chapter ${toArabicNumeral(chapter[1])}${title ? ` · ${en[title] ?? chapterTitleTranslations[title] ?? mappedTitle ?? translateSpecial(title)}` : ""}`;
  }
  const article = value.match(/^第([一二三四五六七八九十百〇零两\d]+)条$/);
  if (article) return `Article ${toArabicNumeral(article[1])}`;
  if (value === "正文") return "Main Text";
  if (cities[value]) return cities[value];
  if (value === "地级市综合保护样本") return en[value];
  if (value === "首批国家历史文化名城样本") return en[value];
  if (value === "地下大遗址型县区样本") return en[value];
  const jurisdiction = value.match(/^(.*?)(市|省|区|县|自治州|自治区)$/);
  if (jurisdiction) {
    const name = cities[jurisdiction[1]];
    if (name) {
      if (jurisdiction[1] === "凉山") return "Liangshan Yi Autonomous Prefecture";
      if (jurisdiction[1] === "湘西") return "Xiangxi Tujia and Miao Autonomous Prefecture";
      if (jurisdiction[1] === "黔东南") return "Qiandongnan Miao and Dong Autonomous Prefecture";
      const suffix: Record<string, string> = { 市: "", 省: " Province", 区: " District", 县: " County", 自治州: " Autonomous Prefecture", 自治区: " Autonomous Region" };
      return `${name}${suffix[jurisdiction[2]]}`;
    }
  }
  if (value.startsWith("第") && value.endsWith("条")) return value;
  if (value.includes("历史文化名城保护条例")) {
    let title = value;
    const qualifier = title.match(/[（(](\d{4})(修订|修正)[）)]/);
    title = title.replace(/[（(]\d{4}(?:修订|修正)[）)]/g, "");
    const locality = Object.keys(cities).sort((a, b) => b.length - a.length).find((city) => title.startsWith(city));
    const name = locality ? cities[locality] : "China";
    let translated = `Regulations on the Protection of Historic and Cultural Cities in ${name}`;
    if (title.includes("人民代表大会") && title.includes("修改")) translated = `Decision of the Standing Committee of the ${name} People's Congress on Amending the Regulations on the Protection of Historic and Cultural Cities`;
    if (qualifier) translated += ` (${qualifier[1]} ${qualifier[2] === "修订" ? "Revision" : "Amendment"})`;
    return translated;
  }
  let output = value;
  for (const [cn, latin] of Object.entries(cities).sort((a, b) => b[0].length - a[0].length)) output = output.replaceAll(cn, latin);
  return output;
}

const chapterTitleTranslations: Record<string, string> = {
  "总则": "General Provisions", "保护与利用": "Protection and Use", "保护与管理": "Protection and Administration",
  "保护内容": "Protected Matters", "保护内容和要求": "Protected Matters and Requirements", "保护名录": "Protection List",
  "保护措施": "Protection Measures", "保护范围和对象": "Protected Areas and Subjects", "保护要求": "Protection Requirements",
  "保护规划": "Protection Plans", "保护规划和风貌管控": "Protection Planning and Character Controls",
  "保护责任和保护措施": "Protection Responsibilities and Measures", "历史建筑保护": "Protection of Historic Buildings",
  "历史建筑的保护": "Protection of Historic Buildings", "历史文化街区的保护": "Protection of Historic and Cultural Blocks",
  "历史文化风貌保护区和 历史文化街区、村镇的保护": "Protection of Historic-Character Areas and Historic and Cultural Blocks, Towns, and Villages",
  "古遗址区域的保护": "Protection of Ancient Site Areas", "建筑保护": "Building Protection",
  "老城格局和城市风貌的保护": "Protection of the Old City's Pattern and Urban Character",
  "风貌管控和保护措施": "Character Controls and Protection Measures",
  "黄丝桥古城和南方长城保护": "Protection of Huangsiqiao Ancient City and the Southern Great Wall",
  "凤凰古城保护": "Protection of Fenghuang Ancient City", "保护体系": "Protection Framework",
  "保护对象": "Protected Subjects", "保护对象与保护名录": "Protected Subjects and the Protection List",
  "保护对象和名录": "Protected Subjects and Lists", "保护范围": "Protected Areas",
  "保护规划和保护名录": "Protection Plans and Lists", "申报批准和保护名录": "Nomination, Approval and Protection List",
  "规划与名录": "Planning and Lists", "规划与实施": "Planning and Implementation", "法律责任": "Legal Liability",
  "不可移动文物的保护": "Protection of Immovable Cultural Relics", "传承与利用": "Transmission and Use",
  "传承利用": "Transmission and Use", "保护利用": "Protection and Use", "保护和利用": "Protection and Use",
  "其他对象的保护": "Protection of Other Subjects", "利用与传承": "Use and Transmission", "利用传承": "Use and Transmission",
  "历史文化风貌区域的保护": "Protection of Historic-Character Areas", "古城保护": "Protection of the Ancient City",
  "合理利用": "Rational Use", "监督检查": "Inspection and Oversight", "附则": "Supplementary Provisions",
  "监督管理": "Supervision and Administration", "保障监督": "Safeguards and Oversight",
  "规划与管理": "Planning and Administration", "古城墙及其以内区域的保护": "Protection of the City Wall and the Area Within It",
  "文物、历史建筑和历史遗址（迹）的保护": "Protection of Cultural Relics, Historic Buildings and Historic Sites",
  "生态环境保护": "Ecological Protection", "非物质文化遗产保护": "Protection of Intangible Cultural Heritage",
  "非物质文化遗产的保护": "Protection of Intangible Cultural Heritage", "历史文化名城的规划": "Planning for the Historic and Cultural City",
  "历史文化名城保护规划": "Protection Plan for the Historic and Cultural City", "历史城区保护": "Protection of the Historic Urban Area",
  "历史文化街区保护": "Protection of Historic and Cultural Blocks", "保护对象与规范完备": "Protected Assets and Regulatory Completeness",
};

export function translateText(value: string, locale: Locale) {
  if (locale === "zh") return value;
  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  const key = value.trim().replace(/\s+/g, " ");
  const translated = en[key] ?? translateSpecial(key);
  return `${leading}${translated}${trailing}`;
}

function translateNode(node: ReactNode, locale: Locale): ReactNode {
  if (typeof node === "string") return translateText(node, locale);
  if (Array.isArray(node)) return node.map((child) => translateNode(child, locale));
  if (!isValidElement<{ children?: ReactNode }>(node)) return node;
  const props: Record<string, unknown> = { ...node.props };
  if ("children" in props) props.children = translateNode(props.children as ReactNode, locale);
  for (const attribute of ["aria-label", "title", "placeholder", "alt"]) {
    const value = props[attribute];
    if (typeof value === "string") props[attribute] = translateText(value, locale);
  }
  return cloneElement(node as ReactElement<Record<string, unknown>>, props);
}

export function LocalizedTree({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <>{translateNode(children, locale)}</>;
}
