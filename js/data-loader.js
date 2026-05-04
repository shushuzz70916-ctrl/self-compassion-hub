// ===== Data Loader =====
// Load data from embedded script tag (file:// compatible)
function loadData(id) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Data element #${id} not found`);
  return JSON.parse(el.textContent);
}

// ===== Render Utilities =====
function renderTags(tags) {
  if (!tags || !tags.length) return '';
  return tags.map(t => `<span class="tag">${t}</span>`).join('');
}

function renderDOILink(doi, label) {
  if (!doi) return '';
  const url = doi.startsWith('http') ? doi : `https://doi.org/${doi}`;
  return `<a href="${url}" class="doi-link" target="_blank" rel="noopener">${label || 'DOI'}</a>`;
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
          <div class="label">${m.component}</div>
          <p style="font-size:.9rem;color:var(--text-light);margin-top:.3rem">${m.desc}</p>
          <div class="polarity">
            <span class="positive">✓ ${m.positive}</span> vs <span class="negative">✗ ${m.negative}</span>
          </div>
        </div>
      `).join('');
    }

    // Programs
    if (data.programs) {
      const list = document.getElementById('programs-list');
      list.innerHTML = data.programs.map(p => `
        <div class="research-card">
          <h4>${p.name}</h4>
          <div class="meta"><span>开发者: ${p.developer}</span><span>年龄段: ${p.age}</span><span>形式: ${p.format}</span></div>
          <p style="margin:.5rem 0">${p.description}</p>
          <div class="finding"><strong>关键发现:</strong> ${p.keyFinding}</div>
          ${p.doi ? `<a href="${p.doi.startsWith('http') ? p.doi : 'https://doi.org/' + p.doi}" class="doi-link" target="_blank" rel="noopener">📄 ${p.doi}</a>` : ''}
        </div>
      `).join('');
    }

    // Key studies
    if (data.studies) {
      const list = document.getElementById('studies-list');
      list.innerHTML = data.studies.map(s => `
        <div class="research-card">
          <h4>${s.title}</h4>
          <div class="meta">
            <span>${s.authors}</span><span>${s.journal} (${s.year})</span>
            ${s.doi ? `<a href="${s.doi.startsWith('http') ? s.doi : 'https://doi.org/' + s.doi}" class="doi-link" target="_blank" rel="noopener">DOI</a>` : ''}
          </div>
          <div class="finding">${s.finding}</div>
          ${s.sample ? `<p style="font-size:.85rem;color:var(--text-light)">样本: ${s.sample}</p>` : ''}
        </div>
      `).join('');
    }

    // Meta-analyses table
    if (data.metaAnalyses) {
      const tbody = document.getElementById('meta-table-body');
      tbody.innerHTML = data.metaAnalyses.map(m => `
        <tr>
          <td>${m.authors} (${m.year})</td>
          <td>${m.journal}</td>
          <td>${m.scope}</td>
          <td>${m.keyFinding}</td>
          <td>${renderDOILink(m.doi, '链接')}</td>
        </tr>
      `).join('');
    }
  } catch(e) {
    console.error('Error loading interventions data:', e);
  }
}

// ===== Victimization Page =====
async function renderVictimization() {
  try {
    const data = loadData('data-victimization');

    // Types
    if (data.types) {
      const list = document.getElementById('types-list');
      list.innerHTML = data.types.map(t => `
        <div class="research-card">
          <h4>${t.name}</h4>
          <p>${t.description}</p>
          <div class="meta" style="margin-top:.5rem"><span>流行率: ${t.prevalence}</span></div>
          ${renderTags(t.tags)}
        </div>
      `).join('');
    }

    // Key studies
    if (data.studies) {
      const list = document.getElementById('vict-studies-list');
      list.innerHTML = data.studies.map(s => `
        <div class="research-card">
          <h4>${s.title}</h4>
          <div class="meta">
            <span>${s.authors}</span><span>${s.journal} (${s.year})</span>
            ${s.doi ? `<a href="${s.doi.startsWith('http') ? s.doi : 'https://doi.org/' + s.doi}" class="doi-link" target="_blank" rel="noopener">DOI</a>` : ''}
          </div>
          <div class="finding">${s.finding}</div>
          ${s.sample ? `<p style="font-size:.85rem;color:var(--text-light)">样本: ${s.sample}</p>` : ''}
        </div>
      `).join('');
    }

    // Meta-analyses
    if (data.metaAnalyses) {
      const tbody = document.getElementById('vict-meta-table-body');
      tbody.innerHTML = data.metaAnalyses.map(m => `
        <tr>
          <td>${m.authors} (${m.year})</td>
          <td>${m.journal}</td>
          <td>${m.scope}</td>
          <td>${m.keyFinding}</td>
          <td>${renderDOILink(m.doi, '链接')}</td>
        </tr>
      `).join('');
    }

    // SC protective factor
    if (data.protectiveFactor) {
      const list = document.getElementById('sc-protective');
      list.innerHTML = data.protectiveFactor.map(p => `
        <div class="research-card">
          <h4>${p.study}</h4>
          <div class="finding">${p.finding}</div>
          ${p.doi ? renderDOILink(p.doi, '查看论文') : ''}
        </div>
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
    html += `<div class="uni-section"><h3>${uni}</h3>`;
    researchers.forEach(r => {
      html += `
        <div class="researcher-card">
          <div class="name">${r.name}${r.title ? ' — ' + r.title : ''}</div>
          <div class="affil">${r.university}</div>
          <div class="dept">${r.department || ''}</div>
          <div class="focus">${renderTags(r.focus)}</div>
          ${r.summary ? `<p style="font-size:.92rem;margin:.5rem 0;color:var(--text-light)">${r.summary}</p>` : ''}
          ${r.publications && r.publications.length ? `
            <div class="pubs"><strong>代表论文:</strong><ul>${r.publications.map(p =>
              `<li>${p.title} — <em>${p.journal}</em> (${p.year}) ${p.doi ? `<a href="${p.doi.startsWith('http') ? p.doi : 'https://doi.org/' + p.doi}" class="doi-link" target="_blank" rel="noopener">DOI</a>` : ''}</li>`
            ).join('')}</ul></div>
          ` : ''}
          ${r.profileUrl ? `<a href="${r.profileUrl}" class="profile-link" target="_blank" rel="noopener">查看个人主页 →</a>` : ''}
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
