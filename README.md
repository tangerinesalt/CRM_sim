# MiniCRM Simulator

MiniCRM Simulator 是一个中文优先的 Windows 桌面 CRM 模拟器。它使用 Tauri、React、TypeScript 和 Zustand，以本地模拟数据演示从线索进入到客户跟进、商机推进、成交订单、售后服务和数据看板的完整 CRM 业务闭环。

项目上下文保存在：

- `openspec/project.md`：OpenSpec 使用的项目上下文
- `openspec/project_cn.md`：便于人工阅读和回顾的中文版本

## 核心约束

- 应用以简体中文为主要界面语言。
- 不接入真实客户数据。
- 不上传任何本地数据。
- 所有客户、联系人、手机号、邮箱、订单、合同和跟进记录均为模拟数据。
- 第一版目标是离线可用、权限清晰、流程闭环、易于打包发布的 Windows 桌面应用。

## 技术栈

- Tauri
- React
- TypeScript
- Zustand
- Vite
- pnpm
- JSON seed 数据
- localStorage 本地模拟持久化

## 本地运行

安装依赖：

```powershell
pnpm install
```

启动浏览器开发模式：

```powershell
pnpm dev
```

启动 Tauri 桌面开发模式：

```powershell
pnpm tauri dev
```

构建前端：

```powershell
pnpm build
```

构建 Windows 桌面调试包：

```powershell
pnpm tauri build --debug
```

## 模拟账号

| 用户名 | 身份 | 说明 |
| --- | --- | --- |
| `admin` | 管理员 | 全局数据、系统配置、重置模拟数据 |
| `manager01` | 主管 | 团队数据、线索分配、团队看板 |
| `staff01` | 员工 | 个人客户、线索、商机、订单、售后 |
| `staff02` | 员工 | 个人客户、线索、商机、订单、售后 |

应用右上角可以直接切换模拟身份，不做真实密码校验。

## 模拟数据

系统启动时会加载 seed 数据，并在浏览器/Tauri WebView 的本地存储中保存操作结果。管理员可以一键恢复初始模拟数据。

导出文件默认命名为 `demo-crm-data.json`。导入只接受模拟器 JSON 模板，不支持真实客户 Excel。

## OpenSpec

本项目使用 OpenSpec 做规格驱动开发。初始化后可通过 OpenSpec 流程创建变更、设计和任务。

当前主要变更：

- `bootstrap-tauri-crm-mvp`：从工程骨架到中文 CRM MVP 的完整实施规格。
