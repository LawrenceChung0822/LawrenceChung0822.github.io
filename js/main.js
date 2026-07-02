/**
 * 个人主页交互逻辑
 * 1. 语言切换
 * 2. 滚动淡入动画
 * 3. 导航栏滚动状态
 * 4. 横向时间轴滚动驱动
 */

// --- 语言切换 ---
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.lang;
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.body.classList.toggle('lang-en', lang === 'en');
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
  });
});

// --- 滚动淡入 ---
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// --- 导航栏滚动状态 ---
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// --- 横向时间轴 ---
function updateTimeline() {
  const section = document.querySelector('.timeline-section');
  const track = document.querySelector('.timeline-track');
  const progress = document.querySelector('.timeline-progress');
  if (!section || !track) return;

  // 移动端使用垂直布局，跳过
  if (window.innerWidth <= 768) return;

  const rect = section.getBoundingClientRect();
  const scrollable = section.offsetHeight - window.innerHeight;
  const scrolled = Math.max(0, Math.min(scrollable, -rect.top));
  const ratio = scrollable > 0 ? scrolled / scrollable : 0;

  // 移动 track
  const trackWidth = track.scrollWidth;
  const maxTranslate = trackWidth - window.innerWidth;
  track.style.transform = `translateX(${-ratio * maxTranslate}px)`;

  // 更新进度线
  if (progress) {
    const trackPadding = window.innerWidth * 0.15;
    progress.style.width = `${ratio * (trackWidth - trackPadding * 2)}px`;
    progress.style.left = `${trackPadding}px`;
  }

  // 高亮当前节点
  const nodes = document.querySelectorAll('.timeline-node');
  const viewportCenter = window.innerWidth / 2;
  let closest = null;
  let minDist = Infinity;

  nodes.forEach(node => {
    const nodeRect = node.getBoundingClientRect();
    const nodeCenter = nodeRect.left + nodeRect.width / 2;
    const dist = Math.abs(nodeCenter - viewportCenter);
    if (dist < minDist) {
      minDist = dist;
      closest = node;
    }
  });

  nodes.forEach(node => {
    node.classList.toggle('active', node === closest);
  });
}

// 使用 requestAnimationFrame 优化性能
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateTimeline();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

window.addEventListener('resize', updateTimeline);

// 初始执行
updateTimeline();
