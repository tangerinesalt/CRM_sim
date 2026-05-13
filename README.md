# MiniCRM Simulator

MiniCRM Simulator 是一个中文优先的 Windows 桌面 CRM 模拟器项目。它以 Tauri、React 和 TypeScript 为目标技术栈，使用本地模拟数据演示从线索进入到客户跟进、商机推进、成交订单、售后服务和数据看板的完整 CRM 业务闭环。

当前仓库处于 OpenSpec 初始化阶段，项目上下文保存在：

- `openspec/project.md`：OpenSpec 使用的项目上下文
- `openspec/project_cn.md`：便于人工阅读和回顾的中文版本

## 核心约束

- 应用以简体中文为主要界面语言。
- 不接入真实客户数据。
- 不上传任何本地数据。
- 所有客户、联系人、手机号、邮箱、订单、合同和跟进记录均为模拟数据。
- 第一版目标是离线可用、权限清晰、流程闭环、易于打包发布的 Windows 桌面应用。

## 计划技术栈

- Tauri
- React
- TypeScript
- Zustand
- CSS Modules 或 Tailwind CSS
- JSON seed 数据
- SQLite 或 JSON 本地持久化

## OpenSpec

本项目使用 OpenSpec 做规格驱动开发。初始化后可通过 OpenSpec 流程创建变更、设计和任务。

