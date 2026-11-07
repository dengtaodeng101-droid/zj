/** 周杰的 Photo — static gallery, favorites and small interactions. */
'use strict';

// 修改照片时，先把图片放入 assets，再修改这里的 id（对应文件名，不含 .webp）。
const photos = [
  { id: 'sunny-day', title: '晴天与草帽', category: 'daily', label: '日常 / DAILY', alt: '戴草帽的周杰在绿树与蓝天下微笑' },
  { id: 'travel-2', title: '在水边，慢下来', category: 'travel', label: '旅行 / TRAVEL', alt: '周杰穿白裙坐在湖边，远处是青山' },
  { id: 'petals', title: '捡起一小朵春天', category: 'daily', label: '日常 / DAILY', alt: '周杰拿着粉色小花，身旁的车上洒满花瓣' },
  { id: 'travel-4', title: '把自己交给风', category: 'travel', label: '旅行 / TRAVEL', alt: '周杰背对镜头，在草地上张开双臂' },
  { id: 'portrait', title: '今天，也要微笑', category: 'daily', label: '日常 / DAILY', alt: '周杰戴着草帽的近照' },
  { id: 'travel-3', title: '在草地上坐一会儿', category: 'travel', label: '旅行 / TRAVEL', alt: '周杰穿白裙坐在草地上' },
  { id: 'travel-1', title: '山野间的一抹白', category: 'travel', label: '旅行 / TRAVEL', alt: '白裙的周杰站在青山与绿草之间' },
  { id: 'travel-5', title: '回头，风景正好', category: 'travel', label: '旅行 / TRAVEL', alt: '周杰在开阔的草地上回头望向镜头' }
];

const storage = {
  read(key, fallback) {
    try { const value = localStorage.getItem(key); return value === null ? fallback : JSON.parse(value); }
    catch { return fallback; }
  },
  write(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* 隐私模式中仍可在本页使用。 */ } }
};
const storedFavorites = storage.read('zhoujie-favorites-v1', []);
const favorites = new Set(Array.isArray(storedFavorites) ? storedFavorites.filter(id => photos.some(p => p.id === id)) : []);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let motionEnabled = storage.read('zhoujie-motion-v1', true) !== false;
let activeFilter = 'all';
let visiblePhotos = [...photos];
let lightboxPhotos = [...photos];
let current = 0;
let previousFocus;
const gallery = document.querySelector('#gallery');
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const motionToggle = document.querySelector('#motion-toggle');
const canAnimate = () => motionEnabled && !reducedMotion.matches;

function updateFavoritesCount() {
  document.querySelector('#favorites-count').textContent = favorites.size;
  document.querySelector('[data-filter="all"] small').textContent = String(photos.length).padStart(2, '0');
}

function renderGallery(animate = false) {
  const oldFavoriteFocus = document.activeElement?.dataset?.favorite;
  visiblePhotos = photos.filter(photo => activeFilter === 'all' || (activeFilter === 'favorites' ? favorites.has(photo.id) : photo.category === activeFilter));
  const items = visiblePhotos.map((photo, index) => {
    const article = document.createElement('article');
    article.className = 'gallery-item' + (animate && canAnimate() ? ' entering' : '');
    article.style.setProperty('--i', index);
    const button = document.createElement('button');
    button.className = 'photo-button';
    button.dataset.photo = photo.id;
    button.setAttribute('aria-label', '放大：' + photo.title);
    const frame = document.createElement('span');
    frame.className = 'image-wrap';
    const img = new Image();
    img.src = `assets/${photo.id}.webp`;
    img.alt = photo.alt;
    img.loading = 'lazy';
    img.width = 600;
    img.height = 800;
    const plus = document.createElement('span');
    plus.className = 'image-plus';
    plus.textContent = '↗';
    plus.setAttribute('aria-hidden', 'true');
    frame.append(img, plus);
    const caption = document.createElement('span');
    caption.className = 'gallery-caption';
    const name = document.createElement('span');
    name.textContent = photo.title;
    const category = document.createElement('small');
    category.textContent = photo.label;
    caption.append(name, category);
    button.append(frame, caption);
    const favorite = document.createElement('button');
    favorite.className = 'favorite-button';
    favorite.dataset.favorite = photo.id;
    setFavoriteButton(favorite, photo);
    article.append(button, favorite);
    return article;
  });
  if (!items.length) {
    const empty = document.createElement('div');
    empty.className = 'gallery-empty';
    const heart = document.createElement('span'); heart.textContent = '♡';
    const title = document.createElement('h3'); title.textContent = '把心动的瞬间，留在这里。';
    const description = document.createElement('p'); description.textContent = '在「全部瞬间」中点击照片右上角的爱心，就能收藏。';
    empty.append(heart, title, description);
    items.push(empty);
  }
  gallery.replaceChildren(...items);
  updateFavoritesCount();
  // 从收藏页移除图片后，把键盘焦点留在可操作的位置。
  if (oldFavoriteFocus) {
    const remaining = [...gallery.querySelectorAll('[data-favorite]')];
    (remaining.find(b => b.dataset.favorite === oldFavoriteFocus) || remaining[0] || document.querySelector('[data-filter="favorites"]')).focus({ preventScroll: true });
  }
}

function setFavoriteButton(button, photo) {
  const selected = favorites.has(photo.id);
  button.setAttribute('aria-pressed', String(selected));
  button.setAttribute('aria-label', (selected ? '取消收藏：' : '收藏：') + photo.title);
  button.title = selected ? '取消收藏' : '收藏这个瞬间';
  button.textContent = selected ? '♥' : '♡';
}

function showPhoto() {
  const photo = lightboxPhotos[current];
  lightboxImage.src = `assets/${photo.id}.webp`;
  lightboxImage.alt = photo.alt;
  document.querySelector('#lightbox-caption').textContent = photo.title;
  document.querySelector('#lightbox-count').textContent = `${String(current + 1).padStart(2, '0')} / ${String(lightboxPhotos.length).padStart(2, '0')}`;
  if (canAnimate()) lightboxImage.animate([{ opacity: .25, transform: 'translateY(7px) scale(.985)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'ease-out' });
}

function openPhoto(id) {
  lightboxPhotos = visiblePhotos.some(photo => photo.id === id) ? [...visiblePhotos] : [...photos];
  current = lightboxPhotos.findIndex(photo => photo.id === id);
  if (current < 0) return;
  previousFocus = document.activeElement;
  lightbox.showModal();
  document.body.classList.add('modal-open');
  showPhoto();
}
function stepPhoto(step) {
  current = (current + step + lightboxPhotos.length) % lightboxPhotos.length;
  showPhoto();
}

// 点击花瓣：只在操作时短暂出现，不持续飘落，也不会挡住点击。
function animateAndRemove(element, frames, options) {
  const animation = element.animate(frames, options);
  animation.finished.then(() => element.remove(), () => element.remove());
}
function blossom(x, y, host) {
  if (!canAnimate() || host.querySelectorAll('.click-petal').length > 45) return;
  for (let i = 0; i < 7; i++) {
    const petal = document.createElement('span');
    petal.className = 'click-petal';
    petal.setAttribute('aria-hidden', 'true');
    petal.textContent = i % 3 === 0 ? '✧' : '♡';
    petal.style.left = `${x}px`;
    petal.style.top = `${y}px`;
    host.append(petal);
    const angle = i / 7 * Math.PI * 2;
    const distance = 32 + Math.random() * 35;
    animateAndRemove(petal, [
      { opacity: .95, transform: 'translate(-50%,-50%) scale(.5) rotate(0deg)' },
      { opacity: 0, transform: `translate(${Math.cos(angle) * distance}px,${Math.sin(angle) * distance - 18}px) scale(1.05) rotate(${i * 35}deg)` }
    ], { duration: 650 + i * 25, easing: 'cubic-bezier(.16,.7,.3,1)' });
  }
}
function ripple(target, x, y) {
  if (!canAnimate() || !target.matches('.primary-link, .filters button')) return;
  const rect = target.getBoundingClientRect();
  const effect = document.createElement('span');
  effect.className = 'ripple';
  effect.setAttribute('aria-hidden', 'true');
  effect.style.left = `${x - rect.left - 15}px`;
  effect.style.top = `${y - rect.top - 15}px`;
  target.append(effect);
  animateAndRemove(effect, [{ transform: 'scale(0)', opacity: .7 }, { transform: 'scale(10)', opacity: 0 }], { duration: 650, easing: 'ease-out' });
}

document.addEventListener('click', event => {
  const target = event.target.closest('button, a');
  // 键盘触发的 click 不需要模拟鼠标位置。
  if (event.detail > 0 && !event.target.closest('#motion-toggle')) {
    blossom(event.clientX, event.clientY, lightbox.open ? lightbox : document.body);
    if (target) ripple(target, event.clientX, event.clientY);
  }
  const favoriteButton = event.target.closest('[data-favorite]');
  if (favoriteButton) {
    const id = favoriteButton.dataset.favorite;
    favorites.has(id) ? favorites.delete(id) : favorites.add(id);
    storage.write('zhoujie-favorites-v1', [...favorites]);
    if (activeFilter === 'favorites') renderGallery();
    else {
      setFavoriteButton(favoriteButton, photos.find(photo => photo.id === id));
      updateFavoritesCount();
      if (canAnimate()) favoriteButton.animate([{ transform: 'scale(.85)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 360 });
    }
    return;
  }
  const photoButton = event.target.closest('[data-photo]');
  if (photoButton) openPhoto(photoButton.dataset.photo);
});

document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(other => {
    other.classList.toggle('active', other === button);
    other.setAttribute('aria-pressed', String(other === button));
  });
  renderGallery(true);
}));
document.querySelector('#close-lightbox').addEventListener('click', () => lightbox.close());
document.querySelector('#prev-photo').addEventListener('click', () => stepPhoto(-1));
document.querySelector('#next-photo').addEventListener('click', () => stepPhoto(1));
lightbox.addEventListener('close', () => { document.body.classList.remove('modal-open'); previousFocus?.focus(); });
lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
lightbox.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault(); stepPhoto(event.key === 'ArrowRight' ? 1 : -1);
  }
});
let touchStart = null;
lightboxImage.addEventListener('touchstart', event => { touchStart = event.changedTouches[0].clientX; }, { passive: true });
lightboxImage.addEventListener('touchend', event => {
  if (touchStart !== null) {
    const distance = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(distance) > 50) stepPhoto(distance < 0 ? 1 : -1);
    touchStart = null;
  }
}, { passive: true });
lightboxImage.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });

const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() {
  mobileNav.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', '打开导航');
}
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  mobileNav.hidden = expanded;
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  menuToggle.setAttribute('aria-label', expanded ? '打开导航' : '关闭导航');
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => { if (!event.target.closest('.header, .mobile-nav')) closeMenu(); });
window.matchMedia('(min-width: 701px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

function syncMotionButton() {
  const enabled = canAnimate();
  motionToggle.setAttribute('aria-pressed', String(enabled));
  motionToggle.setAttribute('aria-label', enabled ? '关闭点击动画' : '开启动画');
  motionToggle.title = enabled ? '关闭点击动画' : reducedMotion.matches ? '系统已开启减少动态效果' : '开启动画';
  motionToggle.querySelector('span').textContent = enabled ? '动效开' : '动效关';
  document.body.classList.toggle('motion-off', !enabled);
  if (!enabled) document.querySelectorAll('.click-petal,.click-ring,.ripple').forEach(element => element.remove());
}
motionToggle.addEventListener('click', () => {
  motionEnabled = !motionEnabled;
  storage.write('zhoujie-motion-v1', motionEnabled);
  syncMotionButton();
});
reducedMotion.addEventListener('change', syncMotionButton);
syncMotionButton();

// 阅读进度与当前章节：只使用滚动后的一个动画帧，避免频繁布局计算。
let scrollQueued = false;
function updateScroll() {
  const range = document.documentElement.scrollHeight - window.innerHeight;
  document.querySelector('.reading-progress').style.transform = `scaleX(${range > 0 ? window.scrollY / range : 0})`;
  document.querySelector('.header').classList.toggle('scrolled', window.scrollY > 30);
  scrollQueued = false;
}
window.addEventListener('scroll', () => {
  if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScroll); }
}, { passive: true });
window.addEventListener('resize', updateScroll);
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) document.querySelectorAll('.header nav a').forEach(link => link.classList.toggle('active', link.hash === '#' + entry.target.id));
    });
  }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
  document.querySelectorAll('main > section[id]').forEach(section => sectionObserver.observe(section));
  const reveals = document.querySelectorAll('.about-photo,.about-copy,.section-heading,.food-card,.note-list article');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('reveal-pending');
        entry.target.classList.add('reveal-ready');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .08 });
  reveals.forEach(element => {
    if (canAnimate()) element.classList.add('reveal-pending');
    revealObserver.observe(element);
  });
}
document.querySelectorAll('.food-image img').forEach(img => img.addEventListener('error', () => {
  img.hidden = true;
  img.parentElement.querySelector('.food-fallback').hidden = false;
}));
document.querySelector('#year').textContent = new Date().getFullYear();
renderGallery();
updateScroll();

// Personal story tabs: auto-activation, keyboard navigation and a short page-turn.
const storyTabs = [...document.querySelectorAll('[data-story-tab]')];
const storyPanels = [...document.querySelectorAll('.story-panel')];
let storyChapter = 0;
function selectStoryChapter(index, focusTab = false) {
  storyChapter = (index + storyTabs.length) % storyTabs.length;
  storyTabs.forEach((tab, tabIndex) => {
    const selected = tabIndex === storyChapter;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    storyPanels[tabIndex].hidden = !selected;
  });
  document.querySelector('#story-prev').disabled = storyChapter === 0;
  const last = storyChapter === storyTabs.length - 1;
  document.querySelector('#story-next').textContent = last ? '回到第一章 ↺' : '继续下一章 →';
  document.querySelector('#story-page').textContent = `${String(storyChapter + 1).padStart(2, '0')} / ${String(storyTabs.length).padStart(2, '0')}`;
  if (focusTab) storyTabs[storyChapter].focus({ preventScroll: true });
  if (canAnimate()) storyPanels[storyChapter].animate([
    { opacity: .2, transform: 'translateY(9px)' },
    { opacity: 1, transform: 'none' }
  ], { duration: 350, easing: 'ease-out' });
  updateScroll();
}
storyTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectStoryChapter(index));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = storyChapter + 1;
    if (event.key === 'ArrowLeft') next = storyChapter - 1;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = storyTabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectStoryChapter(next, true); }
  });
});
document.querySelector('#story-prev').addEventListener('click', () => {
  // 移到首章前先转移焦点，避免焦点停在随后被禁用的按钮上。
  selectStoryChapter(storyChapter - 1, storyChapter === 1);
});
document.querySelector('#story-next').addEventListener('click', () => selectStoryChapter(storyChapter + 1));
