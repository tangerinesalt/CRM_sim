import { Upload } from 'lucide-react';
import { PermissionGuard } from '../components/PermissionGuard';
import { useConfigStore } from '../store/configStore';
import { useCrmStore } from '../store/crmStore';

export function Settings() {
  const { appConfig, permissions } = useConfigStore();
  const { exportData, importData } = useCrmStore();

  return (
    <PermissionGuard moduleId="settings" fallback={<div className="empty-state">当前身份无权访问系统配置。</div>}>
      <div className="split-grid">
        <section className="panel">
          <header className="panel-header">
            <div>
              <h2>系统配置</h2>
              <p>规则来自配置文件，不写死在页面代码中。</p>
            </div>
          </header>
          <div className="detail-grid">
            <Info label="应用名称" value={appConfig.appName} />
            <Info label="默认角色" value={appConfig.defaultRole} />
            <Info label="身份切换" value={appConfig.identitySwitching ? '启用' : '停用'} />
            <Info label="真实数据导入" value={appConfig.allowRealDataImport ? '允许' : '禁止'} />
          </div>
          <h3>销售阶段</h3>
          <div className="tag-list">
            {appConfig.salesStages.map((stage) => (
              <span className="status-pill" key={stage.name}>{stage.name} · {stage.probability}%</span>
            ))}
          </div>
        </section>

        <section className="panel">
          <header className="panel-header">
            <div>
              <h2>模拟数据导入导出</h2>
              <p>仅支持模拟 JSON 模板，不支持真实客户 Excel。</p>
            </div>
          </header>
          <div className="row-actions">
            <button className="primary-button" type="button" onClick={exportData}>导出 demo-crm-data.json</button>
            <label className="file-button">
              <Upload size={16} />
              导入模拟 JSON
              <input
                type="file"
                accept="application/json,.json,.xlsx,.xls"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) {
                    return;
                  }
                  if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                    importData('not-json');
                    event.target.value = '';
                    return;
                  }
                  importData(await file.text());
                  event.target.value = '';
                }}
              />
            </label>
          </div>
          <h3>权限摘要</h3>
          <div className="stack-list">
            {Object.entries(permissions).map(([role, rule]) => (
              <div className="list-row" key={role}>
                <strong>{rule.label}</strong>
                <span>{rule.scope} · {rule.modules.join(' / ')}</span>
                <em>{rule.operations.join(', ')}</em>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PermissionGuard>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="info-tile">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
