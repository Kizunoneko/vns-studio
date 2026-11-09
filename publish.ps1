# 一键发布到 GitHub（本机运行）
# 用法：在 GitHub 上先新建一个空仓库（不要勾 README），然后在这里填地址运行
$repo = Read-Host "粘贴你的仓库地址（例如 https://github.com/你的用户名/vns-studio.git）"
if (-not $repo) { Write-Host "没有地址，退出"; exit }
git init
git add .
git commit -m "视觉小说编辑器 v6.0.3"
git branch -M main
git remote remove origin 2>$null
git remote add origin $repo
git push -u origin main
Write-Host ""
Write-Host "推送完成！如需开启在线版：仓库 Settings -> Pages -> Source 选 main / root"
