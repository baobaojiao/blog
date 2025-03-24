//---------------------------------------------------------------------------------------！！！以下配置需要修改！！！-----------------------------------------------
const adminEmail = ref("1282849754@qq.com"); //填写管理员账号的邮箱，需要与数据库保持一致
//---------------------------------------------------------------------------------------！！！以上配置需要修改！！！-----------------------------------------------

//------------------------------------------------------------------public/other
const userInfo = ref(null); //用户信息
const aduBlogToken = ref(localStorage.getItem("aduBlogToken")); //用户token

const pz_all = ref({
  pzsz: null, //所有配置，原始json数据
  logo: null, //网站logo
  blog_name: null, //博客名称
  author_blog: null, //开发作者博客
  bz_tx: null, //博主头像
  bz_name: null, //博主名称
  icp1: null, //网站备案文字部分
  icp2: null, //网站备案数字部分
  upload_url: null, //图片上传位置
});

const windowWidth = ref(window.innerWidth); //当前窗口宽度

const commentData = ref(null); //评论数据列表
const plData = reactive({
  // 发送评论数据
  type: null,
  targetId: +0,
  content: "",
  nickname: "",
  email: "",
  blogUrl: "",
  commentId: null,
  bhfId: null,
  classify: 0,
  pendant: null, //头像挂件
});
const findPl = reactive({
  // 查询评论条件
  targetId: +0,
  classify: +0,
  pageNum: 1,
  pageSize: 5,
});
const yjplkZz = ref(false); //一级评论框遮罩层
const wzDrawerStzte = ref(false); //私密文章抽屉状态
const chouTiArticle = ref({
  //私密文章抽屉数据
  pwd: "",
  id: 0,
});
const selectedText = ref(null); //网站中被选中的文字
const lyjzdh = ref(false); //切换路由过度动画状态
const ydmsModel = ref(false); //阅读抽屉状态
const participationModal = ref(false); //分享对话框状态
const fxUrl = ref(null); //分享二维码

//-------------------------------------------Music
const musicTheme = ref(
  localStorage.getItem("musicTheme") != null
    ? localStorage.getItem("musicTheme")
    : 1
); //音乐面板主题

const musciList = ref([]); //歌曲列表
let song = ref({
  name: "",
  album: "",
  id: 0,
  url: "",
  singer: "",
  duration: 0,
}); //当前播放歌曲
let musicListState = ref(false); //音乐列表（导航栏）状态
const lyricState = ref(false); //歌词面板状态
const musicState = ref(false); //音乐面板状态
const lyricsObjArr = ref([]); //当前播放的歌词数据
let music_play = ref("icon-bofang1"); //播放ico
const rotateDegree = ref(0); // 音乐专辑旋转角度
const currentTime = ref(0); //播放进度，百分比
const timeBfb = ref(0); //当前播放器时间
let horn = ref("icon-24gf-volumeHigh"); //音量切换ico
let hornState = ref(0); //音量显示与隐藏
const sfzzbf = ref(false); //是否正在播放
let intervalIdMusic = ref(null); //专辑旋转定时器
const volumeNum = ref(0.5); //右击菜单中音量数值

//------------------------------------------------------Navbar
const navTitleState = ref(false); //导航状态
const tqState = ref(true); //天气状态
const navBackground = ref("transparent"); //顶部导航背景
const navDrawerState = ref(false); //导航栏抽屉

//------------------------------------------------------右击菜单
const dhwzys = ref("#363636"); //导航文字颜色
const xhIco = ref("ios-repeat"); //右击音乐循环ico
const visible = ref(false); //右击菜单状态

const yjLeft = ref(0); //右击菜单位置
const yjTop = ref(0); //右击菜单位置

const xhIcoState = ref(true); //右击音乐播放模式ico
const xhTip = ref("顺序播放"); //右击音乐播放模式文字
const jycsdz = ref(null); //存储右击事件的原生对象  用于粘贴

//----------------------------------------------------Zhuti
const syArticleData = ref({
  //首页文章列表
  records: null,
  total: 0,
  current: 1,
});

//----------------------------------------------------------Links
const linksTableData = ref({
  //友联列表数据
  records: [],
  total: 0,
  current: 1,
});

//--------------------------------------------------------------Login
const loginState = ref(false); //登录面板状态

//------------------------------------------------Expression
const ExpressionList = ref(null); //表情列表
const ExpressionType = ref(null); //表情分类列表

//------------------------------------------------打賞
const begData = ref(null); // 打赏名单

export default {
  adminEmail,
  pz_all,
  fxUrl,
  participationModal,
  ydmsModel,
  userInfo,
  musciList,
  song,
  navTitleState,
  tqState,
  navBackground,
  begData,
  musicListState,
  volumeNum,
  lyricState,
  xhIco,
  visible,
  yjLeft,
  yjTop,
  xhIcoState,
  xhTip,
  commentData,
  plData,
  yjplkZz,
  findPl,
  jycsdz,
  wzDrawerStzte,
  chouTiArticle,
  linksTableData,
  dhwzys,
  syArticleData,
  lyricsObjArr,
  music_play,
  intervalIdMusic,
  rotateDegree,
  currentTime,
  horn,
  hornState,
  aduBlogToken,
  loginState,
  timeBfb,
  sfzzbf,
  navDrawerState,
  windowWidth,
  ExpressionList,
  ExpressionType,
  musicState,
  selectedText,
  musicTheme,
  lyjzdh,
};
