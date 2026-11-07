# 周杰的 Photo · 淡粉影像日记

奶油白、淡樱粉与深玫瑰灰搭配的个人摄影网站。使用纯 HTML、CSS 和原生 JavaScript，图片、图标全部随代码提供，不需要服务器、数据库、Node.js 或付费服务。

## 已包含的内容

- 悬浮导航、大幅拱形照片封面、个人介绍、错落照片展墙。
- 「个人故事」导航与四章故事 Tab，支持点击、左右方向键、Home / End 切换。
- 参考本人照片制作的淡粉 Q 版头像，展示于导航和个人故事卡片。
- 日常 / 旅行 / 收藏分类，点击放大，左右按钮、方向键、手机滑动切换，ESC 关闭。
- 照片爱心收藏，保存在访问者本机浏览器中，不上传，不跨设备同步。
- 点击花瓣、按钮波纹、爱心反馈、相册切换与滚动浮现动画。
- 右下角动效开关；自动尊重系统「减少动态效果」设置。
- 手机适配、键盘操作、阅读进度与返回顶部。
- 丝娃娃、酸汤牛肉和遵义豆花面照片，含摄影署名和共享许可链接。

## GitHub Pages 部署（推荐：不需要写命令）

1. 解压 `zhoujie-photo-story-github.zip`，进入 `zhoujie-photo` 文件夹。
2. 登录 GitHub，点右上角 **+ → New repository**，仓库名称可填 `zhoujie-photo`。使用免费个人账号时选择 **Public**，然后创建仓库。
3. 在仓库中选 **Add file → Upload files**。把解压后文件夹里面的 `index.html`、`style.css`、`app.js`、`assets` 文件夹及说明文件一起拖进去。不要把外层 `zhoujie-photo` 文件夹作为嵌套目录上传。
4. 点击 **Commit changes**。确认仓库根目录能直接看到 `index.html`。
5. 打开仓库 **Settings → Pages**。
6. **Build and deployment → Source** 选择 **Deploy from a branch**。
7. Branch 选 `main`，文件夹选 `/(root)`，点 **Save**。如果你使用其他分支名，选择对应分支。
8. 等待构建完成，在 Pages 页面点击 **Visit site** 查看。一般地址为 `https://你的用户名.github.io/zhoujie-photo/`；以 GitHub 实际显示的地址为准。

无需填写任何密钥。所有图片路径都是相对路径，支持用户主页、项目子目录以及自定义域名。

若希望地址为 `https://你的用户名.github.io/`，新建仓库时将仓库命名为 `你的用户名.github.io`，其余步骤相同。

GitHub Pages 发布后的页面通常可公开访问，不带 ChatGPT 登录限制。你自己上传并开启 Pages 即可；本代码包没有替你创建或发布 GitHub 仓库。

官方说明：https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## 文件与修改入口

| 文件 | 用途 |
| --- | --- |
| `index.html` | 姓名、介绍、标题、美食文案、栏目结构 |
| `style.css` | 配色、布局、响应式与动画样式 |
| `app.js` | 文件顶部是照片列表；其余是相册、收藏与交互 |
| `assets/` | 所有个人照片、美食照片与图标 |
| `.nojekyll` | 声明直接使用静态文件 |
| `PHOTO_CREDITS.md` | 外部摄影来源与许可 |
| `PERSONAL_STORY.md` | 完整的个人故事文稿 |

### 换颜色

修改 `style.css` 顶部 `:root`：

```css
--paper: #fcf8f6; /* 奶油白背景 */
--pink: #f6e6e8;  /* 浅粉 */
--rose: #b86f80;  /* 按钮和强调色 */
--rose-dark: #94576a;
--ink: #43343d;   /* 深玫瑰灰文字 */
```

### 添加照片

将新照片转换为 WebP 并放入 `assets/`，在 `app.js` 顶部 `photos` 数组增加一条：

```js
{ id: 'new-photo', title: '照片标题', category: 'daily', label: '日常 / DAILY', alt: '准确描述照片内容' }
```

对应图片文件为 `assets/new-photo.webp`。旅行照片的 category 使用 `travel`。照片总数自动更新。若使用 JPG，请同步调整 `app.js` 中生成图片路径的扩展名。

现有旅行组图从用户提供的长拼图拆分，单帧宽度只有 314 像素；大图清晰度受原图限制，建议后续用同名高清原图替换。

### 本地查看

可直接双击 `index.html` 预览，推荐通过 VS Code 的 Live Server 查看。若 Windows 安装了 Python，在该文件夹打开 PowerShell：

```powershell
py -m http.server 8000
```

浏览器打开 `http://localhost:8000`。收藏与动效偏好保存在浏览器本地；无痕模式或禁止存储时降级为当前页面使用。

## 常见问题

- 打开 GitHub Pages 404：检查根目录是否直接有 `index.html`，以及 Pages 的分支、目录选择是否正确。
- 页面有文字却没有图片：检查 `assets/` 是否上传完整，图片名大小写是否一致，不要手动改成电脑盘符路径。
- 看不到更新：确认仓库新提交已完成部署，再用 Ctrl+F5 强制刷新。
- 手机收藏不同步：这是本机收藏，不是账号系统；不需要登录或后端。
- 想删除联系方式：当前没有添加邮箱、手机号或未经提供的社交账号。

## 内容说明

网站按用户提供的信息使用「周杰、贵州、护士、喜欢拍照与美食、文静、上进、双鱼座」。个人故事依据本轮本人讲述整理为四章，没有添加医院、学校、诊断或成绩数字。成长手记是愿望式文案，没有虚构从业年限、医院、履历或完成日期。布局参考 Galleryee 的留白与展览节奏，以及 s51ss 的悬浮导航、封面和筛选结构；未复制其代码、品牌或作品。

美食照片的授权与网站代码不同，详见 PHOTO_CREDITS.md。个人照片由用户提供，未自动授予第三方共享许可。

## 修改个人故事和头像

故事正文在 `index.html` 的 `id="story"` 区域，四章位于四个 `.story-panel` 中。完整文稿也放在 `PERSONAL_STORY.md`，修改该文稿不会自动更新 HTML，需要同步修改。Tab 的章节数量由 `app.js` 读取；若增加章节，请对应增加按钮与面板并保持 ID、aria-controls 和 aria-labelledby 一致。

头像文件为 `assets/zhoujie-avatar.png`。替换为同名正方形图片即可，导航与故事卡片会同步更新。头像为根据用户提供的照片生成的插画，不属于外部美食摄影的 CC 许可作品。

头像制作方式：内置图像生成。提示词要点：参考本人长黑发、草帽与微笑，生成居中的 Q 版半身头像，淡粉背景、奶油白衣服、柔和手绘线条、少量星光，不含文字。
