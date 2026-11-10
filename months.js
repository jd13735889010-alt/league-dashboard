const MONTH_VERSION='cloud-37c46cdec9ba';
const requestedMonth=new URLSearchParams(location.search).get('month');
const selectedMonth=/^20\d\d-(0[1-9]|1[0-2])$/.test(requestedMonth||'')?requestedMonth:'2026-10';
window.IS_NOVEMBER=selectedMonth!=='2026-10';
window.HAS_UNIFIED_SCORES=true;
window.MONTH_DATA=(window.IS_NOVEMBER?'data-'+selectedMonth+'.json':'data.json')+'?v='+MONTH_VERSION;
window.MONTH_MATCHES=(window.IS_NOVEMBER?'match-details-'+selectedMonth+'.json':'match-details.json')+'?v='+MONTH_VERSION;
document.getElementById('month').value=selectedMonth;
document.getElementById('month').onchange=event=>{const url=new URL(location.href);url.searchParams.set('month',event.target.value);url.searchParams.set('v',MONTH_VERSION);location.assign(url.href)};
window.renderMonth=function(data){
  const [year,numeric]=selectedMonth.split('-'),names=['一','二','三','四','五','六','七','八','九','十','十一','十二'],name=names[Number(numeric)-1],meta=data.meta;const todayMonth=new Date().toLocaleString('sv-SE',{timeZone:'Asia/Shanghai'}).slice(0,7);const nov=selectedMonth>=todayMonth;
  const date=new Date(data.source.fetchedAt).toLocaleString('zh-CN',{timeZone:'Asia/Shanghai',hour12:false});
  document.title='联赛18113 · '+year+'年'+name+'月数据中心';
  document.querySelector('.asidebottom').innerHTML='<span class="dot"></span> '+year+' '+name+'月赛季<br><small>'+(nov?'进行中 · 最近比赛 '+meta.lastMatch:'历史月报 · 最近比赛 '+meta.lastMatch)+'</small>';
  document.querySelector('#overview .eyebrow').textContent=selectedMonth+' · MONTHLY REPORT';
  document.querySelector('#overview .subtitle').textContent='Dota 2 联赛 18113 · '+year+'年'+numeric+'月选手分析 · '+(nov?'进行中':'完整月报');
  document.querySelector('#overview .stats').innerHTML=[['有效比赛',meta.valid,'场',`${meta.official} 场联赛${meta.supplemental?' + '+meta.supplemental+' 场录像补录':''}${meta.excluded?' · '+meta.excluded+' 场已剔除':''}`],['参赛选手',meta.playerCount,'人',`${data.players.length} 条位置记录进入分析`],['参赛队伍',meta.teams,'支','正式联赛内实际队名'],['场均时长',meta.meanDuration.toFixed(1),'分钟',`最近比赛：${meta.lastMatch.replace('-','月')}日`]].map(([label,value,unit,note])=>`<article><small>${label}</small><strong>${value} <em>${unit}</em></strong><p>${note}</p></article>`).join('');
  document.querySelector('#overview .insights').innerHTML=[['01 / '+(nov?'进行中月份':'历史月份'),Number(numeric)+'月1日 — '+Number(numeric)+'月'+new Date(Number(year),Number(numeric),0).getDate()+'日',`已核实 ${meta.valid} 场有效比赛。${nov?'本月数据尚未完整。':'比分异常场次继续剔除。'}`],['02 / 选手分析','按统一口径评分','卡片、逐场评分与MVP使用一致口径，旧版评分已更新。'],['03 / 数据状态',nov?'采集至 '+date:'历史比赛已核对',nov?(data.source.collectionNote||'已逐场核实联赛比赛。'):'保留原月报已核实的位置、场次和胜负记录。']].map(([label,title,note])=>`<article><label>${label}</label><h3>${title}</h3><p>${note}</p></article>`).join('');
  document.querySelector('#ranking .sectionhead > .muted').textContent='仅展示该位置 ≥5 场的选手记录';
  document.getElementById('empty').textContent='当前筛选下没有达标选手。';
  document.querySelector('#cards > p').textContent='本月达到3场的位置生成卡片；3–4场标注样本偏少。位置来源见比赛明细。';
  document.querySelector('#dimensions').nextElementSibling.textContent='核心第五轴为推进，辅助第五轴为视野；选手与同位置选手比较。';
  document.querySelector('#matches > p').textContent='比分为双方击杀数；按北京时间归月。展开查看十人数据、位置与评分。';
  document.getElementById('source-note').textContent=`${numeric}月来源：已核实的联赛18113比赛${meta.supplemental?'及用户确认的录像补录':''}。本月 ${meta.valid} 场有效比赛、${meta.playerCount} 名选手。月度评分、逐场评分及MVP均已统一更新；静态快照，非实时。`;
  document.getElementById('sample-note').textContent='3–4场仅供初步参考，满5场进入位置排名。推断位置可能存在偏差；短局单独标注。未公开或未解析的比赛可能暂未收录。';
};

fetch('month-list.json?v='+MONTH_VERSION).then(r=>{if(!r.ok)throw Error('month-list');return r.json()}).then(months=>{const select=document.getElementById('month');select.innerHTML=months.filter(m=>/^20\d\d-(0[1-9]|1[0-2])$/.test(m)).map(m=>'<option value="'+m+'">'+m.slice(0,4)+'年'+Number(m.slice(5))+'月</option>').join('');select.value=selectedMonth}).catch(()=>{});
