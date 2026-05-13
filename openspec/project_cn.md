# 项目上下文

## 项目目的

MiniCRM Simulator 是一个 Windows 桌面端 CRM 模拟器。它使用本地模拟数据，演示一条完整的 CRM 业务闭环：线索进入、线索分配、客户转化、商机跟进、赢单成交、模拟订单生成、售后工单处理和数据看板统计。

本项目用于模拟体验、学习、产品验证和内部演示。系统不得连接或处理真实客户数据。

本应用以中文为主。产品文案、导航名称、表单标签、状态名称、校验提示、模拟业务内容、发布说明和面向用户的文档应优先使用简体中文。代码标识符、配置键、文件名和技术文档中可以使用英文，以提升可维护性。

## 来源参考

- Notion 页面：`研发项目｜基础CRM系统模拟器设计稿_20260513`
- 记录日期：`2026-05-13`
- 来源用途：保存基础 CRM 系统模拟器的产品与研发方案，作为后续 Tauri Windows 桌面应用开发参考。

## 技术栈

- 桌面运行层：Tauri
- 前端：React + TypeScript
- 样式：CSS Modules 或 Tailwind CSS
- 状态管理：Zustand
- 模拟数据：JSON seed 文件
- 本地持久化：SQLite 或 JSON 文件
- 打包：Tauri build
- 发布自动化：GitHub Actions
- 目标平台：Windows 10 和 Windows 11

## 产品原则

- 第一版要小而完整，易于理解和演示。
- 首页只展示最关键的事项和指标。
- 每个页面只完成一个主要任务。
- 表单字段通常控制在 10 个以内。
- 列表页支持搜索、筛选、详情查看和简单分页或滚动。
- 所有模拟操作都可以一键重置。
- 默认登录为管理员，不做真实注册或密码校验。
- 界面必须明确标注当前使用的是模拟数据。
- 角色权限、客户字段、销售阶段、线索来源、客户等级、看板指标和重置规则应放在配置文件中，不应写死在页面组件里。

## 模拟数据与数据约束

- 不接入真实 CRM、邮件、短信、微信、支付、合同或云同步服务。
- 不上传任何本地数据。
- 不采集用户隐私。
- 所有预置公司名、联系人、手机号、邮箱、合同、订单和跟进记录必须是虚构数据。
- 用户新增和编辑的记录也只是本地模拟数据。
- 导出文件仍然必须被视为模拟数据，默认文件名为 `demo-crm-data.json`。
- 只允许导入符合模拟器数据结构的 JSON 文件。
- 明确禁止导入真实客户 Excel 文件，避免误用。
- 应用应支持离线使用。

## 角色与权限

系统内置三类角色：

- `admin`：管理员。拥有全部模块、全部数据、系统配置、身份切换和数据重置权限。
- `manager`：主管。拥有团队范围数据权限；可以分配线索、查看团队 CRM 数据和团队看板；不能修改系统配置或重置全部数据。
- `staff`：员工。拥有个人范围数据权限；可以创建和管理分配给自己的线索、客户、跟进、商机、订单和相关售后工单；不能删除关键数据、查看其他员工客户详情或修改系统配置。

默认账号：

| 用户名 | 角色 | 姓名 | 手机号 | 邮箱 |
| --- | --- | --- | --- | --- |
| `admin` | 管理员 | 陈明 | 13800000001 | admin@demo-crm.local |
| `manager01` | 主管 | 李娜 | 13800000002 | manager01@demo-crm.local |
| `staff01` | 员工 | 王强 | 13800000003 | staff01@demo-crm.local |
| `staff02` | 员工 | 赵敏 | 13800000004 | staff02@demo-crm.local |

## 核心模块

导航应包含：

- 工作台
- 线索管理
- 客户管理
- 商机管理
- 跟进记录
- 订单管理
- 售后服务
- 数据看板
- 系统配置

角色可见性规则：

- 员工不显示系统配置。
- 主管不显示全局配置和全部数据重置入口。
- 管理员显示全部模块。

## 业务闭环

核心端到端流程：

```text
线索进入
  -> 线索分配
  -> 线索跟进
  -> 转为客户
  -> 创建商机
  -> 跟进并推进商机
  -> 商机赢单
  -> 自动生成模拟订单
  -> 创建售后工单
  -> 更新数据看板
```

关键流程规则：

- 有效线索转客户时，应创建客户档案，并让客户进入待跟进状态。
- 从客户创建新商机时，默认销售阶段为初步接触。
- 商机标记为赢单时，应自动创建模拟订单，并将客户状态更新为已成交。
- 商机标记为输单时，必须填写输单原因。
- 售后工单应支持分配、处理、填写处理结果、关闭和满意度记录。

## 领域模型

主要实体：

- 用户：`id`、`username`、`displayName`、`role`、`phone`、`email`、`teamId`、`status`
- 线索：`id`、`companyName`、`contactName`、`phone`、`email`、`source`、`level`、`ownerId`、`status`、`remark`、`createdAt`、`updatedAt`
- 客户：`id`、`name`、`type`、`industry`、`region`、`level`、`mainContactId`、`ownerId`、`status`、`remark`、`createdAt`、`updatedAt`
- 联系人：`id`、`customerId`、`name`、`position`、`phone`、`email`、`wechat`、`isPrimary`、`remark`
- 商机：`id`、`customerId`、`name`、`amount`、`stage`、`probability`、`ownerId`、`expectedCloseDate`、`status`、`lostReason`、`createdAt`、`updatedAt`
- 跟进记录：`id`、`customerId`、`opportunityId`、`userId`、`method`、`content`、`result`、`nextFollowTime`、`createdAt`
- 订单：`id`、`customerId`、`opportunityId`、`orderNo`、`amount`、`status`、`ownerId`、`createdAt`、`updatedAt`
- 售后工单：`id`、`customerId`、`orderId`、`type`、`description`、`handlerId`、`status`、`result`、`satisfactionScore`、`createdAt`、`closedAt`

## 领域取值

线索状态：

- 新线索
- 已分配
- 跟进中
- 已转客户
- 无效线索

客户类型：

- 企业客户
- 个人客户
- 渠道客户

客户等级：

- A 重点客户
- B 普通客户
- C 低优先级客户

客户状态：

- 待跟进
- 跟进中
- 已成交
- 沉默客户
- 流失客户

销售阶段和概率：

| 阶段 | 概率 |
| --- | --- |
| 初步接触 | 20% |
| 需求确认 | 40% |
| 方案报价 | 60% |
| 谈判中 | 80% |
| 赢单 | 100% |
| 输单 | 0% |

跟进方式：

- 电话
- 微信
- 邮件
- 拜访
- 线上会议

跟进结果：

- 客户有兴趣
- 需要报价
- 等待决策
- 暂无预算
- 已成交
- 已拒绝

订单状态：

- 待确认
- 已确认
- 已完成
- 已取消

工单类型：

- 使用咨询
- 功能问题
- 合同问题
- 续费咨询
- 投诉建议

工单状态：

- 待处理
- 处理中
- 已解决
- 已关闭

## 数据看板指标

看板应包含：

- 线索总数
- 客户总数
- 进行中商机数
- 赢单商机数
- 输单商机数
- 模拟成交金额
- 待跟进客户数
- 逾期跟进数
- 售后工单数
- 客户转化率
- 赢单率
- 销售预测金额

指标公式：

- 客户转化率 = 已转客户线索数 / 线索总数
- 赢单率 = 赢单商机数 / 商机总数
- 销售预测金额 = 各阶段商机金额乘以对应销售阶段概率后求和
- 待跟进数量 = 下次跟进时间小于等于今天且未完成的跟进记录数量

## 预期项目结构

```text
src/pages/Dashboard
src/pages/Leads
src/pages/Customers
src/pages/Opportunities
src/pages/FollowUps
src/pages/Orders
src/pages/Tickets
src/pages/Reports
src/pages/Settings
src/components/Layout
src/components/Table
src/components/Form
src/components/Modal
src/components/PermissionGuard
src/store/authStore
src/store/crmStore
src/store/configStore
src/mock/seed-users.json
src/mock/seed-customers.json
src/mock/seed-leads.json
src/mock/seed-opportunities.json
src/mock/seed-followups.json
src/utils/permission.ts
src/utils/id.ts
src/utils/date.ts
src/utils/statistics.ts
src-tauri/src/main.rs
src-tauri/tauri.conf.json
src-tauri/capabilities/default.json
package.json
README.md
release-notes.md
```

## 配置化要求

产品规则和权限规则应使用配置文件管理。

`app-config.json` 应覆盖：

- 应用名称：`MiniCRM Simulator`
- 默认角色：`admin`
- 启用身份切换
- 启用数据重置
- 启用模拟数据导入
- 禁用真实数据导入
- 默认销售阶段
- 默认客户等级
- 默认线索来源
- 默认主题：浅色

`permission-config.json` 应覆盖：

- 管理员可用模块和操作
- 主管可用模块、团队数据范围和禁止操作
- 员工可用模块、个人数据范围和禁止操作

## MVP 范围

第一版必须包含：

- Tauri 项目初始化
- 默认管理员进入应用
- 身份切换
- 工作台
- 线索列表和线索转客户
- 客户列表和客户详情
- 跟进记录
- 商机阶段推进
- 商机赢单后自动生成订单
- 售后工单流程
- 基础数据看板
- 权限控制
- 一键重置模拟数据
- Windows 安装包构建

第一版不包含：

- 真实注册或登录
- 真实短信、邮件、微信、支付、合同或云端集成
- 真实客户数据导入
- 云端同步
- 多租户架构
- 移动端应用
- AI 客服
- 复杂审批流程

## 开发优先级

- P0：Tauri 初始化、页面框架、假数据加载、登录和身份切换、权限守卫、线索/客户/商机/跟进闭环、本地持久化、数据重置。
- P1：订单模块、售后模块、数据看板、系统配置、Windows 打包。
- P2：模拟数据导入导出、自动更新预留、主题配置、多语言预留、更丰富的假数据。

## 验收标准

- Windows 应用可以正常安装和启动。
- 应用默认进入管理员身份。
- 可以切换管理员、主管和员工身份。
- 不同角色看到不同的数据范围和模块权限。
- 用户可以完成线索到客户、客户到商机、商机到订单、订单到售后的完整流程。
- 所有记录和导出文件都明确属于模拟数据。
- 应用可以一键恢复到初始 seed 数据。
- 应用支持离线使用。
- 构建命令可以稳定生成 Windows 安装包。
- 后续新增字段、角色和销售阶段时，不需要大改架构。

