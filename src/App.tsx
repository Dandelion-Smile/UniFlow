import { useState } from 'react'
import {
  Bell,
  BookOpen,
  CalendarClock,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  FileText,
  Filter,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Send,
  Sparkles,
  Wrench,
  X,
} from 'lucide-react'

type Workspace = 'chat' | 'tasks' | 'tickets' | 'knowledge'
type Category = '报修' | '场地申请' | '材料准备' | '通知任务'

const taskRows: Array<{ category: Category; title: string; summary: string; time: string; state: string }> = [
  { category: '报修', title: '教学楼 A-302 投影仪无法开机', summary: '正在补充影响情况与联系人。', time: '刚刚', state: '待补充' },
  { category: '场地申请', title: '申请本周五社团活动教室', summary: '等待确认场地偏好。', time: '10:24', state: '进行中' },
  { category: '材料准备', title: '创新创业比赛报名材料', summary: '还缺指导教师推荐意见。', time: '昨天', state: '待补充' },
  { category: '通知任务', title: '交换项目申请通知', summary: '已提取截止时间和资格要求。', time: '昨天', state: '已完成' },
]

const categoryTone: Record<Category, string> = {
  报修: 'repair',
  场地申请: 'venue',
  材料准备: 'material',
  通知任务: 'notice',
}

function App() {
  const [workspace, setWorkspace] = useState<Workspace>('chat')
  const [hasCurrentTask, setHasCurrentTask] = useState(true)
  const [message, setMessage] = useState('')
  const [showNewTask, setShowNewTask] = useState(false)

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Sparkles size={18} strokeWidth={1.9} /></div>
          <span>UniFlow</span>
        </div>

        <nav className="primary-nav" aria-label="主导航">
          <p className="nav-label">工作台</p>
          <button className={`nav-item ${workspace === 'chat' ? 'active' : ''}`} onClick={() => setWorkspace('chat')}><MessageSquare size={18} />智能体对话</button>
          <button className={`nav-item ${workspace === 'tasks' ? 'active' : ''}`} onClick={() => setWorkspace('tasks')}><ClipboardList size={18} />我的事务<span className="nav-count">4</span></button>
          <button className={`nav-item ${workspace === 'tickets' ? 'active' : ''}`} onClick={() => setWorkspace('tickets')}><Wrench size={18} />服务工单</button>
          <button className={`nav-item ${workspace === 'knowledge' ? 'active' : ''}`} onClick={() => setWorkspace('knowledge')}><BookOpen size={18} />知识与规则</button>
        </nav>

        <div className="sidebar-footer">
          <button className="new-task" onClick={() => setShowNewTask(true)}><Plus size={18} />发起新事务</button>
          <div className="user-row"><div className="avatar">张</div><div><strong>张同学</strong><span>本科生 · 信息学院</span></div><MoreHorizontal size={18} /></div>
        </div>
      </aside>

      {workspace === 'chat' ? (
        <ChatWorkspace
          hasCurrentTask={hasCurrentTask}
          message={message}
          onMessage={setMessage}
          onCloseTask={() => setHasCurrentTask(false)}
          onCreate={() => setShowNewTask(true)}
        />
      ) : workspace === 'tasks' ? <TasksWorkspace onOpenChat={() => setWorkspace('chat')} /> : workspace === 'tickets' ? <ServiceTicketsWorkspace /> : <KnowledgeWorkspace onStartTask={() => setWorkspace('chat')} />}

      {showNewTask && <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowNewTask(false)}>
        <section className="new-task-modal" role="dialog" aria-modal="true" aria-label="发起新事务" onMouseDown={(event) => event.stopPropagation()}>
          <div className="modal-header"><div><span className="eyebrow">发起新事务</span><h2>想先处理什么？</h2></div><button className="icon-button" onClick={() => setShowNewTask(false)} aria-label="关闭"><X size={20} /></button></div>
          <p>告诉 UniFlow 你的需求，它会为你检查规则、整理材料并跟进下一步。</p>
          <textarea placeholder="例如：我要申请下周三晚上的活动教室" autoFocus />
          <div className="modal-actions"><button className="secondary-button" onClick={() => setShowNewTask(false)}>取消</button><button className="primary-button" onClick={() => setShowNewTask(false)}><Sparkles size={17} />开始办理</button></div>
        </section>
      </div>}
    </main>
  )
}

function ChatWorkspace({ hasCurrentTask, message, onMessage, onCloseTask, onCreate }: {
  hasCurrentTask: boolean
  message: string
  onMessage: (value: string) => void
  onCloseTask: () => void
  onCreate: () => void
}) {
  return <section className="chat-workspace">
    <header className="chat-header">
      <div><h1>智能体对话</h1><span><i className="online-dot" />服务正常</span></div>
      <button className="icon-button" aria-label="通知"><Bell size={19} /></button>
    </header>
    <div className={`chat-body ${hasCurrentTask ? '' : 'no-current-task'}`}>
      <section className="agent-conversation" aria-label="与 UniFlow 智能体对话">
        <div className="conversation-scroll">
          <div className="conversation-intro">
            <div className="assistant-avatar large"><Bot size={20} /></div>
            <div><h2>今天需要办理什么？</h2><p>我可以查询校园规则、发起设备报修、准备材料，并为你持续跟进每一步。</p></div>
          </div>
          <div className="suggestion-row">
            <button>报修设备</button><button>申请场地</button><button>整理材料</button>
          </div>
          <div className="chat-divider"><span>今天 10:24</span></div>
          <div className="user-message"><div className="bubble user-bubble">教学楼 A-302 的投影仪无法开机了，帮我报修。</div></div>
          <div className="assistant-message">
            <div className="assistant-avatar"><Bot size={16} /></div>
            <div className="bubble assistant-bubble">
              <p>已识别为<strong>设备报修</strong>。请补充两项信息，我会据此生成工单草稿。</p>
              <div className="question-block"><span className="question-number">01</span><div><strong>故障是否影响正在进行的课程？</strong><p>这会帮助维修人员判断处理优先级。</p></div></div>
              <div className="question-block"><span className="question-number">02</span><div><strong>现场可以联系到谁？</strong><p>请留下姓名或电话号码。</p></div></div>
              <button className="text-action">已检索：《校园设备报修规则》· 普通报修 <ChevronRight size={14} /></button>
            </div>
          </div>
        </div>
        <div className="message-composer">
          <button className="icon-button" aria-label="添加附件"><Paperclip size={19} /></button>
          <input value={message} onChange={(event) => onMessage(event.target.value)} placeholder="补充信息或继续提问..." />
          <button className="send-button" aria-label="发送"><Send size={17} /></button>
        </div>
      </section>
      {hasCurrentTask ? <CurrentTask onClose={onCloseTask} /> : <EmptyTask onCreate={onCreate} />}
    </div>
  </section>
}

function CurrentTask({ onClose }: { onClose: () => void }) {
  return <aside className="current-task" aria-label="当前事务">
    <header><div><span className="side-eyebrow">当前事务</span><h2>报修草稿</h2></div><button className="icon-button" onClick={onClose} aria-label="结束当前事务"><X size={18} /></button></header>
    <div className="current-task-name"><span className="task-icon repair"><Wrench size={17} /></span><div><strong>教学楼 A-302</strong><span>投影仪 · 无法开机</span></div></div>
    <section className="progress-section"><div className="section-title"><h3>下一步</h3><span>待你补充</span></div><label><input type="checkbox" />补充影响程度和联系人</label><label><input type="checkbox" />确认工单后提交</label></section>
    <section className="progress-section execution"><div className="section-title"><h3>执行记录</h3></div><p><strong>已完成：</strong>识别事务、检索规则</p><p><strong>待执行：</strong>查重、创建工单草稿</p></section>
    <div className="task-footnote"><CheckCircle2 size={16} /><span>智能体会在需要你确认时提醒你。</span></div>
  </aside>
}

function EmptyTask({ onCreate }: { onCreate: () => void }) {
  return <aside className="current-task empty-task" aria-label="当前事务">
    <div className="empty-symbol"><ClipboardList size={23} /></div><h2>暂无正在办理的事务</h2><p>在对话中告诉 UniFlow 你的需求，即可开始新的办理流程。</p><button className="secondary-button" onClick={onCreate}><Plus size={16} />发起新事务</button>
  </aside>
}

function TasksWorkspace({ onOpenChat }: { onOpenChat: () => void }) {
  return <section className="tasks-workspace">
    <header className="chat-header"><div><h1>我的事务</h1><span>按更新时间查看所有办理事项</span></div><button className="primary-button" onClick={onOpenChat}><MessageSquare size={17} />进入对话</button></header>
    <div className="tasks-content">
      <div className="tasks-heading"><div><p className="eyebrow">事务中心</p><h2>正在跟进的事务</h2></div><span>共 4 项</span></div>
      <div className="task-list-card">
        {taskRows.map((task) => <article className="task-row" key={task.title}><span className={`task-icon ${categoryTone[task.category]}`}>{task.category === '报修' ? <Wrench size={18} /> : task.category === '材料准备' ? <FileText size={18} /> : <ClipboardList size={18} />}</span><div className="task-content"><span className="task-meta"><b>{task.category}</b><time>{task.time}</time></span><strong>{task.title}</strong><span className="task-summary">{task.summary}</span></div><em className={`status ${task.state === '待补充' ? 'attention' : task.state === '已完成' ? 'done' : ''}`}>{task.state}</em><ChevronRight size={18} /></article>)}
      </div>
    </div>
  </section>
}

const serviceTickets = [
  { id: 1, title: '教学楼 A-302 投影仪无法开机', place: '教学楼 A-302', state: '待确认', time: '刚刚', icon: Wrench, note: '等待补充影响情况与现场联系人' },
  { id: 2, title: '宿舍 6 栋 409 空调异响', place: '学生公寓 6 栋', state: '处理中', time: '10:12', icon: Wrench, note: '维修人员已接单，预计 14:30 到场' },
  { id: 3, title: '图书馆三层照明报修', place: '图书馆三层', state: '已完成', time: '昨天', icon: CalendarClock, note: '后勤中心已完成照明更换' },
]

function ServiceTicketsWorkspace() {
  const [selectedTicket, setSelectedTicket] = useState(1)
  const ticket = serviceTickets.find((item) => item.id === selectedTicket) ?? serviceTickets[0]
  return <section className="service-workspace">
    <header className="chat-header"><div><h1>服务工单</h1><span>查看校园服务的受理与处理进度</span></div><button className="primary-button"><Plus size={17} />新建工单</button></header>
    <div className="service-content">
      <div className="service-overview"><div><span className="metric-value">01</span><span>等待你确认</span></div><div><span className="metric-value">02</span><span>处理中</span></div><div><span className="metric-value muted">08</span><span>本月已完成</span></div><p><CheckCircle2 size={16} />服务中心正在处理 2 个工单</p></div>
      <div className="service-grid">
        <section className="ticket-queue">
          <header className="queue-header"><div><h2>工单队列</h2><span>{serviceTickets.length} 个最近更新</span></div><button className="icon-button" aria-label="筛选工单"><Filter size={18} /></button></header>
          <div className="ticket-filters"><button className="selected">全部</button><button>待确认</button><button>处理中</button><button>已完成</button></div>
          <div className="ticket-list">{serviceTickets.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => setSelectedTicket(item.id)} className={`ticket-row ${selectedTicket === item.id ? 'selected' : ''}`}><span className="task-icon repair"><Icon size={17} /></span><span className="ticket-copy"><span><em className={`ticket-state ${item.state === '待确认' ? 'attention' : item.state === '已完成' ? 'done' : ''}`}>{item.state}</em><time>{item.time}</time></span><strong>{item.title}</strong><small>{item.note}</small></span><ChevronRight size={17} /></button>})}</div>
        </section>
        <section className="ticket-detail">
          <header className="ticket-detail-header"><div><span className="eyebrow">工单详情</span><h2>{ticket.title}</h2></div><button className="icon-button" aria-label="更多工单操作"><MoreHorizontal size={20} /></button></header>
          <div className="ticket-detail-body">
            <div className="detail-facts"><div><MapPin size={16} /><span><small>服务地点</small><strong>{ticket.place}</strong></span></div><div><Clock3 size={16} /><span><small>提交时间</small><strong>今天 10:24</strong></span></div><div><Bot size={16} /><span><small>当前受理</small><strong>UniFlow 服务中心</strong></span></div></div>
            <div className="repair-timeline"><div className="timeline-heading"><h3>处理进度</h3><span>{ticket.state}</span></div><div className="timeline-item complete"><i><Check size={12} /></i><div><strong>已创建报修草稿</strong><span>今天 10:24 · UniFlow 已整理故障描述</span></div></div><div className="timeline-item complete"><i><Check size={12} /></i><div><strong>已核验服务规则</strong><span>今天 10:25 · 适用普通设备报修流程</span></div></div><div className="timeline-item active"><i>3</i><div><strong>等待补充现场信息</strong><span>需要确认影响程度与现场联系人</span></div></div><div className="timeline-item"><i>4</i><div><strong>服务中心受理并派单</strong><span>提交后将由设备管理中心跟进</span></div></div></div>
            <aside className="ticket-next"><span>当前需要你做</span><strong>补充影响程度和联系人</strong><p>确认后，智能体会自动提交工单并同步处理状态。</p><button>返回对话补充 <ChevronRight size={15} /></button></aside>
          </div>
        </section>
      </div>
    </div>
  </section>
}

const ruleGroups = [
  { name: '设备与后勤', count: 12, items: ['校园设备报修规则', '公共区域设施报修', '宿舍维修服务说明'] },
  { name: '场地与活动', count: 8, items: ['学生社团场地申请', '学术活动场地预约'] },
  { name: '学业与材料', count: 15, items: ['竞赛报名材料清单', '奖学金申请说明'] },
]

function KnowledgeWorkspace({ onStartTask }: { onStartTask: () => void }) {
  const [selectedRule, setSelectedRule] = useState('校园设备报修规则')
  const [query, setQuery] = useState('')
  const filteredGroups = ruleGroups.map((group) => ({ ...group, items: group.items.filter((item) => item.includes(query)) })).filter((group) => group.items.length > 0)
  return <section className="knowledge-workspace">
    <header className="chat-header"><div><h1>知识与规则</h1><span>查询学校办事流程、材料与服务规则</span></div><button className="icon-button" aria-label="通知"><Bell size={19} /></button></header>
    <div className="knowledge-body">
      <aside className="rule-index"><div className="rule-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索规则或关键词" /></div><div className="rule-index-title"><span>规则目录</span><small>35 项</small></div>{filteredGroups.map((group) => <section className="rule-group" key={group.name}><div><strong>{group.name}</strong><span>{group.count}</span></div>{group.items.map((item) => <button key={item} onClick={() => setSelectedRule(item)} className={selectedRule === item ? 'selected' : ''}>{item}</button>)}</section>)}</aside>
      <article className="rule-reading"><header><div><span className="eyebrow">设备与后勤 / 服务流程</span><h2>{selectedRule}</h2><p>适用于校内教学、办公及公共区域常规设备故障的维修申请。</p></div><button className="secondary-button" onClick={onStartTask}><MessageSquare size={16} />咨询智能体</button></header><div className="rule-meta"><span>发布单位：设备与实验室管理处</span><span>最近更新：2026-06-18</span><span>状态：现行有效</span></div><section className="rule-section"><h3>适用范围</h3><p>投影仪、计算机、空调、照明及其他由学校统一配置、位于校园管理范围内的教学与公共设备。涉及人身或财产安全的紧急故障，请优先联系校内值班服务。</p></section><section className="rule-section"><h3>办理流程</h3><ol className="rule-steps"><li><span>01</span><div><strong>提交故障信息</strong><p>填写设备位置、故障现象及可联系的现场人员。</p></div></li><li><span>02</span><div><strong>系统核验与分流</strong><p>根据地点、设备类型和影响程度判定服务优先级。</p></div></li><li><span>03</span><div><strong>服务中心派单</strong><p>维修人员接单后将同步预计到场时间。</p></div></li></ol></section><section className="rule-note"><CheckCircle2 size={18} /><div><strong>办理提示</strong><p>上课期间故障请在描述中注明课程开始时间，服务中心会优先处理影响教学的设备。</p></div></section></article>
    </div>
  </section>
}

export default App
