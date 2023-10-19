#!/bin/sh
echo "============================================="
echo "欢迎使用 VanBlog 博客系统"
echo "Github: https://github.com/mereithhh/vanblog"
echo "Version(Env): ${VAN_BLOG_VERSION}"
echo "============================================="

# Debug
set -x

if [ "$VAN_BLOG_BASE_PATH" = "" ]
then
	BASE=""
else
	BASE=$VAN_BLOG_BASE_PATH
fi
sed -e "s/VAN_BLOG_EMAIL/${EMAIL}/g" -e "s/VAN_BLOG_BASE_P/${BASE//\//\\/}/g" /app/caddyTemplate.json >/app/caddy.json
caddy start --config /app/caddy.json

node start.js
