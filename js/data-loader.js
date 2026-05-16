// ===== Data Loader =====
// Load data from embedded script tag (file:// compatible)
function loadData(id) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Data element #${id} not found`);
  return JSON.parse(el.textContent);
}

// ===== Security: HTML Escape =====
// Prevent XSS by escaping HTML special characters
function escapeHtml(unsafe) {
  if (typeof unsafe !== 'string') return unsafe;
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Safe HTML attribute escaper
function escapeAttr(unsafe) {
  if (typeof unsafe !== 'string') return unsafe;
  return escapeHtml(unsafe).replace(/"/g, '&quot;');
}

// ===== Render Utilities =====
function renderTags(tags) {
  if (!tags || !tags.length) return '';
  return tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('');
}

function renderDOILink(doi, label) {
  if (!doi) return '';
  const url = doi.startsWith('http') ? doi : `https://doi.org/${doi}`;
  const safeLabel = escapeHtml(label || 'DOI');
  return `<a href="${escapeAttr(url)}" class="doi-link" target="_blank" rel="noopener">${safeLabel}</a>`;
}

// ===== Interventions Page =====
async function renderInterventions() {
  try {
    const data = loadData('data-interventions');

    // Model diagram
    if (data.model) {
      const diagram = document.getElementById('model-diagram');
      diagram.innerHTML = data.model.map(m => `
        <div class="model-box">
          <div class="label">${escapeHtml(m.component)}</div>
          <p style="font-size:.9rem;color:var(--text-light);margin-top:.3rem">${escapeHtml(m.desc)}</p>
          <div class="polarity">
            <span class="positive">✓ ${escapeHtml(m.positive)}</span> vs <span class="negative">✗ ${escapeHtml(m.negative)}</span>
          </div>
        </div>
      `).join('');
    }

    // Programs
    if (data.programs) {
      const list = document.getElementById('programs-list');
      list.innerHTML = data.programs.map(p => `
        <div class="research-card">
          <h4>${escapeHtml(p.name)}</h4>
          <div class="meta"><span>开发者: ${escapeHtml(p.developer)}</span><span>年龄段: ${escapeHtml(p.age)}</span><span>形式: ${escapeHtml(p.format)}</span></div>
          <p style="margin:.5rem 0">${escapeHtml(p.description)}</p>
          <div class="finding"><strong>关键发现:</strong> ${escapeHtml(p.keyFinding)}</div>
          ${p.doi ? renderDOILink(p.doi, '📄 ' + escapeHtml(p.doi)) : ''}
        </div>
      `).join('');
    }

    // Key studies
    if (data.studies) {
      const list = document.getElementById('studies-list');
      list.innerHTML = data.studies.map(s => `
        <div class="research-card">
          <h4>${escapeHtml(s.title)}</h4>
          <div class="meta">
            <span>${escapeHtml(s.authors)}</span><span>${escapeHtml(s.journal)} (${escapeHtml(String(s.year))})</span>
            ${s.doi ? renderDOILink(s.doi, 'DOI') : ''}
          </div>
          <div class="finding">${escapeHtml(s.finding)}</div>
          ${s.sample ? `<p style="font-size:.85rem;color:var(--text-light)">样本: ${escapeHtml(s.sample)}</p>` : ''}
        </div>
      `).join('');
    }

    // Meta-analyses table
    if (data.metaAnalyses) {
      const tbody = document.getElementById('meta-table-body');
      tbody.innerHTML = data.metaAnalyses.map(m => `
        <tr>
          <td>${escapeHtml(m.authors)} (${escapeHtml(String(m.year))})</td>
          <td>${escapeHtml(m.journal)}</td>
          <td>${escapeHtml(m.scope)}</td>
          <td>${escapeHtml(m.keyFinding)}</td>
          <td>${renderDOILink(m.doi, '链接')}</td>
        </tr>
      `).join('');
    }
  } catch(e) {
    console.error('Error loading interventions data:', e);
  }
}

// ===== Victimization Page (SC × Adolescent Victimization) =====
async function renderVictimization() {
  try {
    const data = loadData('data-victimization');

    // Protection mechanisms
    if (data.mechanisms) {
      const list = document.getElementById('mechanism-list');
      list.innerHTML = data.mechanisms.map(m => `
        <div class="research-card">
          <h4>${escapeHtml(m.title)}</h4>
          <div class="meta"><span>${escapeHtml(m.authors)}</span><span>${escapeHtml(m.journal)}</span></div>
          <div class="finding">${escapeHtml(m.finding)}</div>
          ${m.doi ? renderDOILink(m.doi, 'DOI') : ''}
        </div>
      `).join('');
    }

    // RCTs
    if (data.rcts) {
      const list = document.getElementById('rct-list');
      list.innerHTML = data.rcts.map(r => `
        <div class="research-card">
          <h4>${escapeHtml(r.title)}</h4>
          <div class="meta"><span>${escapeHtml(r.authors)}</span><span>${escapeHtml(String(r.year))}</span></div>
          <div class="finding">${escapeHtml(r.finding)}</div>
          ${r.doi ? renderDOILink(r.doi, '查看注册') : ''}
        </div>
      `).join('');
    }

    // Longitudinal evidence
    if (data.longitudinal) {
      const list = document.getElementById('longitudinal-list');
      list.innerHTML = data.longitudinal.map(l => `
        <div class="research-card">
          <h4>${escapeHtml(l.title)}</h4>
          <div class="meta"><span>${escapeHtml(l.authors)}</span><span>${escapeHtml(l.journal)}</span></div>
          <div class="finding">${escapeHtml(l.finding)}</div>
          ${l.doi ? renderDOILink(l.doi, 'DOI') : ''}
        </div>
      `).join('');
    }

    // Victim type × SC intervention table
    if (data.victimTypes) {
      const tbody = document.getElementById('victim-type-table');
      tbody.innerHTML = data.victimTypes.map(v => `
        <tr>
          <td><strong>${escapeHtml(v.type)}</strong></td>
          <td>${escapeHtml(v.intervention)}</td>
          <td>${escapeHtml(v.study)}</td>
          <td>${escapeHtml(v.finding)}</td>
          <td>${v.doi ? renderDOILink(v.doi, '链接') : ''}</td>
        </tr>
      `).join('');
    }
  } catch(e) {
    console.error('Error loading victimization data:', e);
  }
}

// ===== Researchers Page =====
async function renderResearchers() {
  try {
    const data = loadData('data-researchers');

    // Populate uni filter
    const filter = document.getElementById('uni-filter');
    const unis = [...new Set(data.researchers.map(r => r.university))].sort();
    unis.forEach(u => {
      const opt = document.createElement('option');
      opt.value = u;
      opt.textContent = u;
      filter.appendChild(opt);
    });

    window._researchers = data.researchers;
    filterResearchers();
  } catch(e) {
    console.error('Error loading researchers data:', e);
  }
}

function filterResearchers() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const uni = document.getElementById('uni-filter').value;
  const list = document.getElementById('researchers-list');

  let filtered = (window._researchers || []).filter(r => {
    const matchSearch = !query ||
      r.name.toLowerCase().includes(query) ||
      (r.focus || []).some(f => f.toLowerCase().includes(query)) ||
      (r.department || '').toLowerCase().includes(query);
    const matchUni = !uni || r.university === uni;
    return matchSearch && matchUni;
  });

  if (!filtered.length) {
    list.innerHTML = '<div class="no-results">未找到匹配的研究人员</div>';
    return;
  }

  // Group by university
  const grouped = {};
  filtered.forEach(r => {
    if (!grouped[r.university]) grouped[r.university] = [];
    grouped[r.university].push(r);
  });

  let html = '';
  for (const [uni, researchers] of Object.entries(grouped)) {
    html += `<div class="uni-section"><h3>${escapeHtml(uni)}</h3>`;
    researchers.forEach(r => {
      html += `
        <div class="researcher-card">
          <div class="name">${escapeHtml(r.name)}${r.title ? ' — ' + escapeHtml(r.title) : ''}</div>
          <div class="affil">${escapeHtml(r.university)}</div>
          <div class="dept">${escapeHtml(r.department || '')}</div>
          <div class="focus">${renderTags(r.focus)}</div>
          ${r.summary ? `<p style="font-size:.92rem;margin:.5rem 0;color:var(--text-light)">${escapeHtml(r.summary)}</p>` : ''}
          ${r.publications && r.publications.length ? `
            <div class="pubs"><strong>代表论文:</strong><ul>${r.publications.map(p =>
              `<li>${escapeHtml(p.title)} — <em>${escapeHtml(p.journal)}</em> (${escapeHtml(String(p.year))}) ${p.doi ? renderDOILink(p.doi, 'DOI') : ''}</li>`
            ).join('')}</ul></div>
          ` : ''}
          ${r.profileUrl ? `<a href="${escapeAttr(r.profileUrl)}" class="profile-link" target="_blank" rel="noopener">查看个人主页 →</a>` : ''}
        </div>
      `;
    });
    html += '</div>';
  }
  list.innerHTML = html;
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  if (page === 'interventions') renderInterventions();
  if (page === 'victimization') renderVictimization();
  if (page === 'researchers') renderResearchers();
});
