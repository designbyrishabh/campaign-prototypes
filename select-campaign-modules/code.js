// Select Campaign Modules - Figma plugin
// Builds 5 modules in the current page using the Select Design System library.

(async () => {
  const CK = {
    Header: '312191c45269aba254f9c66b40e35d830e27087f',
    Nav: '815d463fb1b59c722e2982adfe56c8241cc1d80d',
    Buttons: '7d8ed7406a361107ac78ce707cd324c48b927fe4',
    Input: 'c0e1091999e4c459353532a2d6130d2f865559ce',
    Dropdown: '3d1bfb0e7321c2fb5489a0e1de45aecc3b1cc6ea',
    Switch: '3a6fdea5614fd52b6046b90d71cc2ccaeffa6a40',
    Badge: '5f4255bd4d5e1d93acb5b875d3679f6e2894fca6',
    Toggle: 'd77b1bf7b7f550819c09e97700c0385d85786d28',
    Steps: '2e829ede6a66e82314254856661796712ea81c6d',
    Stepper: '905187565b1a01d8139ab7bdba584ca9bd728a10',
    TableHeader: '5d810ed857f970144aac793f2a465221a25321de',
    TableContent: '198699c2f3da2fe06451fc79b26a37e0fdc22237',
    TableActions: '817eb008b99272dfd936e7e080a00f91633d1357',
    Pagination: 'e4586e831bcc9d331675f269a22d4b0d50bdadba',
    Checkbox: 'fdde4c4ca60f96477b658c9de2a1c92dee60db62',
    Radio: '398b5459d57a10261056c12590352feb937495c9',
    ic_search: 'dff10c401b7ebfe17543c2abdd3014f915db453b',
    ic_edit: '293ebfc0ea3b50e5b9970d823b6d5950f7e6928e',
    ic_trash: '5c9f1bff7656cc0b0e9ea7df488c77ac0d026c0d',
    ic_duplicate: '4f46a9b4a6798f0e6afa543aa46f877e86301cec',
    ic_menu: '02f731a13a6f63d7f2375fc4988e106e513af73e',
    ic_help: '08baafab3c477f1f879c5da8670f0c93d43d1c89',
    ic_calendar: '3e7f39a4cb00e7ca3f74379d6117879d6e321076',
    ic_dollar: 'eea55bcd33a1832e5bd895a893d1612dce608c46',
    ic_check: 'e1173be83b650bdf1eb74d50690006928ad6948d',
    ic_arrow_left: 'a606641a2d2243d1cc7c05d50c8a5d6934a096dd',
    ic_info: '273d940f2a8fee65e653ea10a0d729f8f9333a09',
    ic_warning: 'd019fb3d5fdc80cd88b1085a00b79f396c4253e3',
    ic_archive: 'e1e27a515eb0ad8c636f099a4dd0089cfa228d76',
  };

  const VK = {
    bg: '39648521b4342abc8ebe539577b6e5dd479a14f8',
    bgLight: '228d47969c00f99df0f34790f462fcf6b457f0de',
    bgDark: '445d8aae92698365d4caa901a95ed01c3b84d87f',
    text: '8b958924139a7fec8a0373b45999dbb904351ad8',
    textSec: 'ddacf3f30d976f80bbe90fd093cb22e5d9a04ca2',
    textTer: 'de72047a4e7a9f63bfd6eb146fedb530386db354',
    textLink: '5cbd090c80246bed6b3960eec3eea7e920673d41',
    brand: '32ed478ed3ebe0ca49329a1a1b41c8e118a947b5',
    brandBg: '4cbbf165b816836f5121aa0845760a8f70025d67',
    brandLight: '1ac6635ff91c6fc61bf6e3e41a63a4ec1041c453',
    border: 'e8a77125b0db131148514df6374f70debe0c2fcb',
    borderSec: 'ccf51c5b78067ee9243b7614e88c951c2c258424',
    borderBrand: '1b1610fb67d3e1e1e0beb48087218789d873dd27',
    icon: '71f4919662476f0086725756b1b5f8c55398d37f',
    iconSec: 'b9601a6876af5d908ab1f32d92bdcd7ce56caad9',
    rSm: '34111e1afc51b03f9961aea788878a17afdd68ac',
    rMd: '80477de78ffecbed05e581713810ca334bb8d02c',
    rLg: '8ea07cf68613b440397c2e4ab960d87ffe60224b',
    rFull: 'cc58e0890343bc191aa931337c1bf5e86e7adc9e',
  };

  // Load components
  figma.notify('Loading components from Select DS…');
  const C = {};
  for (const [name, key] of Object.entries(CK)) {
    try {
      let c;
      try { c = await figma.importComponentSetByKeyAsync(key); }
      catch (_) { c = await figma.importComponentByKeyAsync(key); }
      C[name] = c;
    } catch (e) { C[name] = null; }
  }

  const V = {};
  for (const [name, key] of Object.entries(VK)) {
    try { V[name] = await figma.variables.importVariableByKeyAsync(key); }
    catch (e) { V[name] = null; }
  }

  // Load fonts
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });

  // ---------- helpers ----------
  function bindFill(node, varKey) {
    if (!V[varKey]) return;
    const fills = JSON.parse(JSON.stringify(node.fills || []));
    if (!fills.length) {
      fills.push({ type: 'SOLID', color: { r: 1, g: 1, b: 1 } });
    }
    fills[0] = figma.variables.setBoundVariableForPaint(fills[0], 'color', V[varKey]);
    node.fills = fills;
  }

  function frame(opts = {}) {
    const f = figma.createFrame();
    if (opts.name) f.name = opts.name;
    if (opts.layout) {
      f.layoutMode = opts.layout; // 'VERTICAL' | 'HORIZONTAL'
      f.primaryAxisSizingMode = opts.primarySizing || 'AUTO';
      f.counterAxisSizingMode = opts.counterSizing || 'AUTO';
      if (opts.gap !== undefined) f.itemSpacing = opts.gap;
      if (opts.padding !== undefined) {
        f.paddingTop = f.paddingRight = f.paddingBottom = f.paddingLeft = opts.padding;
      } else {
        if (opts.py !== undefined) f.paddingTop = f.paddingBottom = opts.py;
        if (opts.px !== undefined) f.paddingLeft = f.paddingRight = opts.px;
      }
      if (opts.align) f.counterAxisAlignItems = opts.align; // 'MIN'|'CENTER'|'MAX'
      if (opts.justify) f.primaryAxisAlignItems = opts.justify;
    }
    if (opts.width) f.resize(opts.width, f.height);
    if (opts.height) f.resize(f.width, opts.height);
    if (opts.fillVar) {
      f.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      bindFill(f, opts.fillVar);
    } else if (opts.fill) {
      f.fills = [{ type: 'SOLID', color: opts.fill }];
    } else if (opts.noFill) {
      f.fills = [];
    }
    if (opts.radius !== undefined) f.cornerRadius = opts.radius;
    if (opts.borderVar) {
      f.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
      const strokes = JSON.parse(JSON.stringify(f.strokes));
      strokes[0] = figma.variables.setBoundVariableForPaint(strokes[0], 'color', V[opts.borderVar]);
      f.strokes = strokes;
      f.strokeWeight = 1;
    }
    if (opts.layoutAlign) f.layoutAlign = opts.layoutAlign;
    if (opts.layoutGrow !== undefined) f.layoutGrow = opts.layoutGrow;
    return f;
  }

  function text(content, opts = {}) {
    const t = figma.createText();
    t.fontName = { family: 'Inter', style: opts.weight || 'Regular' };
    t.characters = content;
    t.fontSize = opts.size || 14;
    if (opts.colorVar) {
      t.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
      bindFill(t, opts.colorVar);
    } else {
      t.fills = [{ type: 'SOLID', color: opts.color || { r: 0.13, g: 0.13, b: 0.13 } }];
    }
    if (opts.layoutAlign) t.layoutAlign = opts.layoutAlign;
    if (opts.lineHeight) t.lineHeight = { value: opts.lineHeight, unit: 'PIXELS' };
    return t;
  }

  function setProps(inst, props) {
    if (!inst || !props) return;
    const def = inst.componentProperties;
    const out = {};
    for (const [k, v] of Object.entries(props)) {
      // find full prop key (e.g. "Text#247:20")
      const full = Object.keys(def).find(p => p === k || p.split('#')[0] === k);
      if (full) out[full] = v;
    }
    try { inst.setProperties(out); } catch (e) { /* swallow */ }
  }

  function instOf(setName, variantProps, otherProps) {
    const node = C[setName];
    if (!node) return null;
    let inst;
    if (node.type === 'COMPONENT_SET') {
      inst = node.defaultVariant.createInstance();
      if (variantProps) setProps(inst, variantProps);
    } else {
      inst = node.createInstance();
    }
    if (otherProps) setProps(inst, otherProps);
    return inst;
  }

  function btn(label, type = 'Primary', size = 'Large', opts = {}) {
    const i = instOf('Buttons',
      { State: 'Default', Type: type, Size: size },
      { Text: label, ...(opts.showLeft ? { 'Show Left Icon': true } : {}), ...(opts.showRight ? { 'Show Right Icon': true } : {}) }
    );
    return i;
  }

  function inputField(value, state = 'Default', size = 'Large') {
    return instOf('Input', { State: state, Size: size }, { Value: value });
  }

  function dd(label, size = 'Large') {
    const i = instOf('Dropdown', { State: 'Default', Size: size });
    if (i && label) {
      try {
        const txt = i.findOne(n => n.type === 'TEXT' && /Label|Value|Placeholder/i.test(n.name));
        if (txt) { txt.characters = label; }
      } catch(e){}
    }
    return i;
  }

  function badge(label, type = 'Default', variant = 'Default', size = 'Default') {
    return instOf('Badge', { Variant: variant, Type: type, Size: size }, { 'Value Text': label });
  }

  function sw(checked = true, size = 'Default') {
    return instOf('Switch', { Size: size, Checked: checked ? 'True' : 'False', Disabled: 'False' });
  }

  function tableCell(type = 'Text', text1) {
    const i = instOf('TableContent', { Type: type });
    if (i && text1) {
      try {
        const t = i.findOne(n => n.type === 'TEXT');
        if (t) t.characters = text1;
      } catch(e){}
    }
    return i;
  }

  function pageChrome(title) {
    // 1440x900 frame, header + sidebar
    const root = frame({
      name: title,
      layout: 'HORIZONTAL', primarySizing: 'FIXED', counterSizing: 'FIXED',
      width: 1440, height: 900,
      fillVar: 'bgLight',
    });
    root.clipsContent = true;

    // Sidebar
    const sidebar = instOf('Nav');
    if (sidebar) { sidebar.layoutAlign = 'STRETCH'; root.appendChild(sidebar); }

    // Right column = header + content
    const right = frame({
      name: 'Main', layout: 'VERTICAL', primarySizing: 'FIXED', counterSizing: 'FIXED',
      width: 1440 - 248, height: 900, gap: 0, noFill: true
    });
    right.layoutGrow = 1;
    right.layoutAlign = 'STRETCH';
    root.appendChild(right);

    const header = instOf('Header');
    if (header) { header.layoutAlign = 'STRETCH'; right.appendChild(header); }

    const body = frame({
      name: 'Body', layout: 'VERTICAL', primarySizing: 'AUTO', counterSizing: 'FIXED',
      gap: 16, padding: 24, fillVar: 'bgLight'
    });
    body.layoutAlign = 'STRETCH';
    body.layoutGrow = 1;
    right.appendChild(body);

    return { root, body };
  }

  function pageHeaderRow(left, right) {
    const row = frame({
      name: 'Page Header', layout: 'HORIZONTAL', counterSizing: 'AUTO',
      gap: 16, py: 4, align: 'CENTER', noFill: true
    });
    row.layoutAlign = 'STRETCH';
    row.primaryAxisAlignItems = 'SPACE_BETWEEN';
    if (left) row.appendChild(left);
    if (right) row.appendChild(right);
    return row;
  }

  function card(children = []) {
    const c = frame({
      name: 'Card', layout: 'VERTICAL', counterSizing: 'AUTO', primarySizing: 'AUTO',
      gap: 16, padding: 24, fillVar: 'bg', radius: 12, borderVar: 'border'
    });
    c.layoutAlign = 'STRETCH';
    for (const ch of children) if (ch) c.appendChild(ch);
    return c;
  }

  function row(children = [], opts = {}) {
    const r = frame({
      name: opts.name || 'Row', layout: 'HORIZONTAL',
      gap: opts.gap !== undefined ? opts.gap : 12,
      align: opts.align || 'CENTER', noFill: true
    });
    if (opts.stretch) r.layoutAlign = 'STRETCH';
    if (opts.justify) r.primaryAxisAlignItems = opts.justify;
    for (const ch of children) if (ch) r.appendChild(ch);
    return r;
  }

  function col(children = [], opts = {}) {
    const c = frame({
      name: opts.name || 'Col', layout: 'VERTICAL',
      gap: opts.gap !== undefined ? opts.gap : 8,
      noFill: true
    });
    if (opts.stretch) c.layoutAlign = 'STRETCH';
    if (opts.grow) c.layoutGrow = 1;
    for (const ch of children) if (ch) c.appendChild(ch);
    return c;
  }

  function field(label, control) {
    const c = col([
      text(label, { size: 13, weight: 'Medium', colorVar: 'textSec' }),
      control
    ], { gap: 6, stretch: true });
    if (control && control.layoutAlign !== undefined) control.layoutAlign = 'STRETCH';
    return c;
  }

  function tableHeaderCell(label, w) {
    const cell = frame({
      name: 'HeaderCell', layout: 'HORIZONTAL', counterSizing: 'FIXED', primarySizing: 'FIXED',
      width: w, height: 46, px: 16, py: 12, align: 'CENTER', gap: 4, fillVar: 'bgLight'
    });
    cell.appendChild(text(label, { size: 13, weight: 'Semi Bold', colorVar: 'textSec' }));
    return cell;
  }

  function tableBodyCell(content, w) {
    const cell = frame({
      name: 'Cell', layout: 'HORIZONTAL', counterSizing: 'FIXED', primarySizing: 'FIXED',
      width: w, height: 56, px: 16, py: 12, align: 'CENTER', gap: 8, noFill: true
    });
    if (typeof content === 'string') {
      cell.appendChild(text(content, { size: 14, colorVar: 'text' }));
    } else if (content) {
      cell.appendChild(content);
    }
    return cell;
  }

  function buildTable({ headers, rows, widths }) {
    const t = frame({
      name: 'Table', layout: 'VERTICAL', primarySizing: 'AUTO', counterSizing: 'AUTO',
      gap: 0, fillVar: 'bg', radius: 8, borderVar: 'border'
    });
    t.clipsContent = true;
    t.layoutAlign = 'STRETCH';

    // Header
    const hr = frame({
      name: 'HeaderRow', layout: 'HORIZONTAL', counterSizing: 'AUTO', primarySizing: 'AUTO',
      gap: 0, fillVar: 'bgLight'
    });
    hr.layoutAlign = 'STRETCH';
    headers.forEach((h, i) => hr.appendChild(tableHeaderCell(h, widths[i])));
    t.appendChild(hr);

    rows.forEach((rcells, idx) => {
      const r = frame({
        name: 'BodyRow', layout: 'HORIZONTAL', counterSizing: 'AUTO', primarySizing: 'AUTO',
        gap: 0, fillVar: 'bg', borderVar: 'border'
      });
      r.layoutAlign = 'STRETCH';
      r.strokeTopWeight = 1;
      r.strokeBottomWeight = 0;
      r.strokeLeftWeight = 0;
      r.strokeRightWeight = 0;
      rcells.forEach((c, i) => r.appendChild(tableBodyCell(c, widths[i])));
      t.appendChild(r);
    });
    return t;
  }

  function progressBar(percent, color) {
    const wrap = frame({
      name: 'Progress', layout: 'VERTICAL', counterSizing: 'FIXED', primarySizing: 'AUTO',
      width: 140, gap: 4, noFill: true
    });
    const track = frame({
      name: 'Track', layout: 'HORIZONTAL', counterSizing: 'FIXED', primarySizing: 'FIXED',
      width: 140, height: 6, fill: { r: 0.93, g: 0.93, b: 0.95 }, radius: 999
    });
    const fill = frame({
      name: 'Fill', layout: 'HORIZONTAL', counterSizing: 'FIXED', primarySizing: 'FIXED',
      width: Math.round(140 * percent / 100), height: 6, fill: color, radius: 999
    });
    track.appendChild(fill);
    wrap.appendChild(track);
    return wrap;
  }

  function pacingCell(percent, label, color) {
    const c = col([progressBar(percent, color), text(label, { size: 12, colorVar: 'textSec' })], { gap: 4 });
    return c;
  }

  function actionsCell() {
    const r = frame({
      name: 'Actions', layout: 'HORIZONTAL', counterSizing: 'AUTO', primarySizing: 'AUTO',
      gap: 8, align: 'CENTER', noFill: true
    });
    const a1 = instOf('TableActions', { Icon: 'Edit', 'Is Hover': 'False' });
    const a2 = instOf('TableActions', { Icon: 'Trash', 'Is Hover': 'False' });
    if (a1) r.appendChild(a1);
    if (a2) r.appendChild(a2);
    return r;
  }

  // ===== Module 1 — Advertisers List =====
  async function buildAdvertisersList() {
    const { root, body } = pageChrome('Advertisers - Listing Page');

    // ---- Page header (title + search + icon buttons + Create) ----
    const titleLeft = text('Advertisers', { size: 24, weight: 'Bold', colorVar: 'text' });

    const search = inputField('Search by Advertiser Name', 'Default', 'Default');
    if (search) search.resize(273, search.height);

    // Icon-only square buttons (download + columns) — 38x38
    const iconBtn = (iconKey) => {
      const f = frame({
        name: 'IconBtn', layout: 'HORIZONTAL', counterSizing: 'FIXED', primarySizing: 'FIXED',
        width: 38, height: 38, radius: 6, fillVar: 'bg', borderVar: 'border',
        align: 'CENTER', justify: 'CENTER'
      });
      const ic = C[iconKey] ? C[iconKey].createInstance() : null;
      if (ic) f.appendChild(ic);
      return f;
    };
    const downloadBtn = iconBtn('ic_archive');   // download placeholder
    const columnsBtn  = iconBtn('ic_menu');      // columns/grid placeholder

    const createBtn = btn('Create Advertiser', 'Primary', 'Large');

    const titleRight = row(
      [search, downloadBtn, columnsBtn, createBtn].filter(Boolean),
      { gap: 8, align: 'CENTER' }
    );

    body.appendChild(pageHeaderRow(titleLeft, titleRight));

    // ---- Listing card: chip row + table + pagination footer ----
    // Filter chip row
    const filterFunnel = C.ic_menu ? C.ic_menu.createInstance() : null;
    if (filterFunnel) filterFunnel.resize(20, 20);
    const chip = badge('Status: Active +3', 'Info', 'Outline', 'Default');

    const addChipBtn = frame({
      name: 'AddFilter', layout: 'HORIZONTAL', counterSizing: 'FIXED', primarySizing: 'FIXED',
      width: 28, height: 28, radius: 4, noFill: true, borderVar: 'border',
      align: 'CENTER', justify: 'CENTER'
    });
    addChipBtn.appendChild(text('+', { size: 14, weight: 'Medium', colorVar: 'textTer' }));

    const chipRow = row([filterFunnel, chip, addChipBtn].filter(Boolean), { gap: 8, align: 'CENTER' });
    chipRow.layoutAlign = 'STRETCH';

    // ---- Rich-cell helpers ----
    const dealIdCell = () => col([
      text('cs_32361749038528',     { size: 14, weight: 'Medium', colorVar: 'text' }),
      text('pr-test-live-04081232', { size: 12, colorVar: 'textSec' })
    ], { gap: 4 });

    const partnerCell = (lines) => {
      const arr = Array.isArray(lines) ? lines : [lines];
      return col(arr.map(l => text(l, { size: 14, colorVar: 'text' })), { gap: 2 });
    };

    const greenDot = () => {
      const d = frame({
        name: 'Dot', layout: 'HORIZONTAL', counterSizing: 'FIXED', primarySizing: 'FIXED',
        width: 6, height: 6, radius: 999, fill: { r: 0.10, g: 0.64, b: 0.36 }
      });
      return d;
    };
    const syncBullet = (label) => row(
      [greenDot(), text(label, { size: 13, colorVar: 'text' })],
      { gap: 6, align: 'CENTER' }
    );
    const syncStatusCell = (items, more) => {
      const parts = items.map(i => syncBullet(i));
      if (more) parts.push(text('+' + more + ' more', { size: 12, colorVar: 'textLink', weight: 'Medium' }));
      return col(parts, { gap: 4 });
    };

    const actionsCell3 = () => {
      const r = frame({
        name: 'Actions', layout: 'HORIZONTAL', counterSizing: 'AUTO', primarySizing: 'AUTO',
        gap: 4, align: 'CENTER', noFill: true
      });
      const tryAction = (icon) => instOf('TableActions', { Icon: icon, 'Is Hover': 'False' });
      const a1 = tryAction('Edit');
      const a2 = tryAction('Duplicate') || tryAction('Copy');
      const a3 = tryAction('Archive')   || tryAction('Trash');
      [a1, a2, a3].filter(Boolean).forEach(n => r.appendChild(n));
      return r;
    };

    // ---- Custom rich-table builder (auto-height rows) ----
    function buildRichTable({ headers, rows: rowsData, widths, alignH, alignV }) {
      const t = frame({
        name: 'Table', layout: 'VERTICAL', primarySizing: 'AUTO', counterSizing: 'AUTO',
        gap: 0, fillVar: 'bg', radius: 8, borderVar: 'border'
      });
      t.clipsContent = true;
      t.layoutAlign = 'STRETCH';

      // Header row
      const hr = frame({
        name: 'HeaderRow', layout: 'HORIZONTAL', counterSizing: 'AUTO', primarySizing: 'AUTO',
        gap: 0, fillVar: 'bgLight'
      });
      hr.layoutAlign = 'STRETCH';
      headers.forEach((h, i) => hr.appendChild(tableHeaderCell(h, widths[i])));
      t.appendChild(hr);

      rowsData.forEach((rcells) => {
        const r = frame({
          name: 'BodyRow', layout: 'HORIZONTAL', counterSizing: 'AUTO', primarySizing: 'AUTO',
          gap: 0, fillVar: 'bg', borderVar: 'border'
        });
        r.layoutAlign = 'STRETCH';
        r.strokeTopWeight = 1;
        r.strokeBottomWeight = 0;
        r.strokeLeftWeight = 0;
        r.strokeRightWeight = 0;

        rcells.forEach((c, i) => {
          const cell = frame({
            name: 'Cell', layout: 'HORIZONTAL', counterSizing: 'AUTO', primarySizing: 'FIXED',
            width: widths[i], px: 16, py: 16,
            align: (alignV && alignV[i]) || 'CENTER',
            justify: (alignH && alignH[i]) || 'MIN',
            gap: 8, noFill: true
          });
          try { cell.minHeight = 56; } catch (e) { /* ignore if API not supported */ }
          if (typeof c === 'string') {
            cell.appendChild(text(c, { size: 14, colorVar: 'text' }));
          } else if (c) {
            cell.appendChild(c);
          }
          r.appendChild(cell);
        });
        t.appendChild(r);
      });
      return t;
    }

    // Column widths (sum = 1096 = body inner width)
    const widths = [249, 230, 91, 191, 75, 128, 132];
    const tableRows = [
      [dealIdCell(), partnerCell('DV 360'),                                  '$1.1', 'Today - Tomorrow',     sw(true), syncStatusCell(['TTD']),                actionsCell3()],
      [dealIdCell(), partnerCell(['StackAdapt via Bidswitch,', 'DV 360, Criteo +3']), '$1.1', 'Today - Tomorrow',     sw(true), syncStatusCell(['TTD','DV 360'], 2),    actionsCell3()],
      [dealIdCell(), partnerCell(['Deep Intent, Springserve -', 'Integration Sync']), '$1.1', '08/04/25 - Today',     sw(true), syncStatusCell(['TTD']),                actionsCell3()],
      [dealIdCell(), partnerCell('DV 360'),                                  '$1.1', '08/02/25 - 08/03/25',  sw(true), syncStatusCell(['TTD']),                actionsCell3()],
      [dealIdCell(), partnerCell('TTD, Criteo'),                             '$1.1', '08/02/25 - 08/03/25',  sw(true), syncStatusCell(['TTD']),                actionsCell3()],
      [dealIdCell(), partnerCell('DV 360'),                                  '$1.1', '08/02/25 - 08/03/25',  sw(true), syncStatusCell(['TTD','DV 360'], 2),    actionsCell3()],
      [dealIdCell(), partnerCell('DV 360'),                                  '$1.1', '08/02/25 - 08/03/25',  sw(true), syncStatusCell(['TTD','DV 360'], 2),    actionsCell3()],
      [dealIdCell(), partnerCell('DV 360'),                                  '$1.1', '08/02/25 - 08/03/25',  sw(true), syncStatusCell(['TTD','DV 360'], 2),    actionsCell3()],
      [dealIdCell(), partnerCell('DV 360'),                                  '$1.1', '08/02/25 - 08/03/25',  sw(true), syncStatusCell(['TTD','DV 360'], 2),    actionsCell3()],
    ];

    const tbl = buildRichTable({
      headers: ['Deal ID', 'Demand Partner', 'Bid Floor', 'Campaign Dates', 'Status', 'Sync Status', 'Actions'],
      rows: tableRows,
      widths,
      alignH: ['MIN','MIN','MIN','MIN','MIN','MIN','MIN'],
      alignV: ['CENTER','CENTER','CENTER','CENTER','CENTER','CENTER','CENTER']
    });

    // ---- Pagination footer ----
    const pagerBtn = (label, disabled) => {
      const f = frame({
        name: 'PagerBtn', layout: 'HORIZONTAL', counterSizing: 'FIXED', primarySizing: 'FIXED',
        width: 38, height: 38, radius: 6, fillVar: 'bg', borderVar: 'border',
        align: 'CENTER', justify: 'CENTER'
      });
      f.appendChild(text(label, { size: 14, weight: 'Medium', colorVar: disabled ? 'textTer' : 'textSec' }));
      return f;
    };

    const pagerLeft = row([
      pagerBtn('‹', true),
      pagerBtn('›', false),
      text('Showing 1-10 of 50', { size: 13, colorVar: 'textSec' }),
    ], { gap: 12, align: 'CENTER' });

    const pagerRight = row([
      text('Rows per page', { size: 13, colorVar: 'textSec' }),
      dd('10', 'Default'),
    ], { gap: 12, align: 'CENTER' });

    const pagination = row([pagerLeft, pagerRight], {
      gap: 16, stretch: true, justify: 'SPACE_BETWEEN', align: 'CENTER'
    });

    body.appendChild(card([chipRow, tbl, pagination]));

    return root;
  }

  // ===== Module 2 — Create Advertiser =====
  async function buildCreateAdvertiser() {
    const { root, body } = pageChrome('2 — Create Advertiser');

    // Header row: back arrow + title + stepper
    const backIcon = C.ic_arrow_left ? C.ic_arrow_left.createInstance() : null;
    const title = row([backIcon, text('Create Advertiser', { size: 24, weight: 'Bold', colorVar: 'text' })].filter(Boolean), { gap: 12 });
    const stepper = instOf('Stepper', { 'Total Steps': '2' });
    if (stepper) {
      try {
        const labels = stepper.findAll(n => n.type === 'TEXT');
        if (labels[0]) labels[0].characters = 'Advertiser Details';
        if (labels[1]) labels[1].characters = 'Insertion Orders';
      } catch (e) {}
    }
    body.appendChild(pageHeaderRow(title, stepper));

    // Card 1: Advertiser Details
    const detailsTitle = text('Advertiser Details', { size: 18, weight: 'Semi Bold', colorVar: 'text' });
    const r1 = row([
      field('Advertiser ID *', inputField('A-987654321', 'Disabled', 'Large')),
      field('Advertiser Name *', inputField('New Retail Brand', 'With Value', 'Large')),
    ], { gap: 16, stretch: true });
    r1.children.forEach(ch => ch.layoutGrow = 1);
    const r2 = row([
      field('Vertical *', dd('Retail', 'Large')),
      field('Timezone *', dd('EST', 'Large')),
    ], { gap: 16, stretch: true });
    r2.children.forEach(ch => ch.layoutGrow = 1);
    body.appendChild(card([detailsTitle, r1, r2]));

    // Card 2: Insertion Orders
    const ioHeaderRight = btn('+ Create IO', 'Secondary', 'Medium');
    const ioTitle = row([text('Insertion Orders', { size: 18, weight: 'Semi Bold', colorVar: 'text' }), ioHeaderRight].filter(Boolean), { gap: 16, stretch: true, justify: 'SPACE_BETWEEN' });
    const ioWidths = [160, 240, 480, 200];
    const ioRows = [
      ['ID-101', 'Retail Q2', 'Summer styles promotion', '$50,000.00'],
      ['ID-102', 'Holiday Push', 'Q3/Q4 combined effort', '$120,000.00'],
      ['ID-103', 'Back to School', 'Student targeted ads', '$35,000.00'],
    ];
    body.appendChild(card([
      ioTitle,
      buildTable({ headers: ['ID', 'Name', 'Description', 'Amount'], rows: ioRows, widths: ioWidths })
    ]));

    // Sticky footer
    const footer = row([btn('Save and Continue', 'Primary', 'Large')], { gap: 12, justify: 'MAX', stretch: true });
    body.appendChild(footer);

    return root;
  }

  // ===== Module 3 — Campaign Listing =====
  async function buildCampaignListing() {
    const { root, body } = pageChrome('3 — Campaign Listing');

    const backIcon = C.ic_arrow_left ? C.ic_arrow_left.createInstance() : null;
    body.appendChild(pageHeaderRow(
      row([backIcon, text('Campaign Listing', { size: 24, weight: 'Bold', colorVar: 'text' })].filter(Boolean), { gap: 12 }),
      null
    ));

    const cardTitleRow = row([
      text('Campaigns', { size: 18, weight: 'Semi Bold', colorVar: 'text' }),
      btn('+ Create New Campaign', 'Primary', 'Large')
    ], { gap: 16, stretch: true, justify: 'SPACE_BETWEEN' });

    const colors = {
      green: { r: 0.13, g: 0.65, b: 0.4 },
      yellow: { r: 0.96, g: 0.75, b: 0.27 },
      gray: { r: 0.78, g: 0.78, b: 0.81 }
    };

    const widths = [280, 220, 130, 130, 130, 132];
    const rows = [
      ['Winter Sale 2022 - Global', pacingCell(85, '85% (On Track)', colors.green), '12 / 12', '18 days', sw(true), actionsCell()],
      ['New Retail Brand Launch - Mobile', pacingCell(100, '100% (On Pace)', colors.green), '8 / 8', '3 days', sw(true), actionsCell()],
      ['Summer Collection - Contextual Test', pacingCell(40, '40% (Slow Pacing)', colors.yellow), '1 / 5', '35 days', sw(false), actionsCell()],
      ['Draft Campaign', pacingCell(0, 'N/A', colors.gray), '0 / 0', 'N/A', sw(false), actionsCell()],
      ['Winter Sale 2022 - Global', pacingCell(100, '100% (On Track)', colors.green), '1 / 0', 'N/A', sw(true), actionsCell()],
      ['Summer Collection - Sim - Test', pacingCell(40, '40% (Slow Pacing)', colors.green), '0 / 0', 'N/A', sw(true), actionsCell()],
      ['New Retail Brand Launch - Mobile', pacingCell(10, '10% (On Pace)', colors.gray), '0 / 0', 'N/A', sw(true), actionsCell()],
    ];
    const tbl = buildTable({
      headers: ['Campaign', 'Pacing', 'Approved Ads', 'Days Remaining', 'Status', 'Actions'],
      rows, widths
    });

    const pagination = row([
      text('1-10 of 42 Campaigns', { size: 13, colorVar: 'textSec' }),
      row([
        text('Prev', { size: 13, colorVar: 'textSec' }),
        text('1', { size: 13, weight: 'Semi Bold', colorVar: 'brand' }),
        text('2', { size: 13, colorVar: 'textSec' }),
        text('3', { size: 13, colorVar: 'textSec' }),
        text('…', { size: 13, colorVar: 'textSec' }),
        text('10', { size: 13, colorVar: 'textSec' }),
        text('Next', { size: 13, colorVar: 'textSec' }),
      ], { gap: 12 })
    ], { gap: 16, stretch: true, justify: 'SPACE_BETWEEN' });

    body.appendChild(card([cardTitleRow, tbl, pagination]));
    return root;
  }

  // ===== Module 4 — Create Campaign (Details) =====
  async function buildCreateCampaignDetails() {
    const { root, body } = pageChrome('4 — Create Campaign – Details');

    const backIcon = C.ic_arrow_left ? C.ic_arrow_left.createInstance() : null;
    const title = row([backIcon, text('Create Campaign', { size: 24, weight: 'Bold', colorVar: 'text' })].filter(Boolean), { gap: 12 });
    const stepper = instOf('Stepper', { 'Total Steps': '3' });
    if (stepper) {
      try {
        const labels = stepper.findAll(n => n.type === 'TEXT');
        if (labels[0]) labels[0].characters = 'Campaign Details';
        if (labels[1]) labels[1].characters = 'Creatives';
        if (labels[2]) labels[2].characters = 'Targeting';
      } catch (e) {}
    }
    body.appendChild(pageHeaderRow(title, stepper));

    // Campaign Details card
    const cdTitle = text('Campaign Details', { size: 18, weight: 'Semi Bold', colorVar: 'text' });

    const advLabel = col([
      text('Advertiser', { size: 13, colorVar: 'textSec' }),
      text('New Retail Brand', { size: 14, weight: 'Medium', colorVar: 'text' })
    ], { gap: 4 });

    const typeBox = frame({
      name: 'Type', layout: 'HORIZONTAL', counterSizing: 'FIXED', primarySizing: 'FIXED',
      width: 560, height: 56, px: 16, align: 'CENTER',
      fillVar: 'bgLight', radius: 6, borderVar: 'border'
    });
    typeBox.primaryAxisAlignItems = 'SPACE_BETWEEN';
    typeBox.appendChild(text('Type', { size: 13, colorVar: 'textSec' }));
    typeBox.appendChild(text('Display', { size: 14, weight: 'Medium', colorVar: 'text' }));

    const r1 = row([
      col([advLabel, field('Deal ID', dd('D-12345', 'Large'))], { gap: 16, grow: true }),
      col([typeBox, row([
        C.ic_info ? C.ic_info.createInstance() : null,
        text('Derived from Deal', { size: 12, colorVar: 'textSec' })
      ].filter(Boolean), { gap: 6 })], { gap: 6, grow: true }),
    ], { gap: 16, stretch: true });

    const r2 = field('Name', inputField('New Retail Brand - D-12345 Campaign', 'With Value', 'Large'));

    const r3 = row([
      field('Start Date', inputField('Start Date', 'Default', 'Large')),
      field('End Date', inputField('End Date', 'Default', 'Large')),
    ], { gap: 16, stretch: true });
    r3.children.forEach(ch => ch.layoutGrow = 1);

    const objectiveLabel = text('Objective *', { size: 14, weight: 'Medium', colorVar: 'text' });

    // Goal & Budget conditional sub-card
    const gbTitle = text('Goal & Budget (Conditional)', { size: 14, weight: 'Semi Bold', colorVar: 'textSec' });
    const gbRow1 = row([
      field('Budget per Conversion (CPA Target) *', inputField('$ 0.00', 'Default', 'Large')),
      field('Total Campaign Budget', inputField('$ 0.00', 'Disabled', 'Large')),
      field('Daily Budget', inputField('$ 0.00', 'Disabled', 'Large')),
    ], { gap: 16, stretch: true });
    gbRow1.children.forEach(ch => ch.layoutGrow = 1);

    const gbRow2 = row([
      field('Pacing', dd('Accelerated', 'Large')),
      field('Bid Strategy', dd('Auto', 'Large')),
    ], { gap: 16, stretch: true });
    gbRow2.children.forEach(ch => ch.layoutGrow = 1);

    const gbRow3 = row([
      field('Goal *', dd('CPA', 'Large')),
      col([
        text(' ', { size: 13, colorVar: 'textSec' }),
        row([
          text('Note:', { size: 13, weight: 'Semi Bold', colorVar: 'text' }),
          text('Billing will be in CPM', { size: 13, colorVar: 'textSec' })
        ], { gap: 6, align: 'CENTER' })
      ], { gap: 6, grow: true })
    ], { gap: 16, stretch: true });
    gbRow3.children[0].layoutGrow = 1;

    const gbBox = frame({
      name: 'Goal & Budget', layout: 'VERTICAL', counterSizing: 'AUTO',
      gap: 16, padding: 16, fillVar: 'bgLight', radius: 8, borderVar: 'border'
    });
    gbBox.layoutAlign = 'STRETCH';
    [gbTitle, gbRow1, gbRow2, gbRow3].forEach(n => gbBox.appendChild(n));

    body.appendChild(card([cdTitle, r1, r2, r3, objectiveLabel, gbBox]));

    body.appendChild(row([btn('Save and Continue', 'Primary', 'Large')], { gap: 12, justify: 'MAX', stretch: true }));

    return root;
  }

  // ===== Module 5 — Create Campaign (Creatives) =====
  async function buildCreateCampaignCreatives() {
    const { root, body } = pageChrome('5 — Create Campaign – Creatives');

    const backIcon = C.ic_arrow_left ? C.ic_arrow_left.createInstance() : null;
    const title = row([backIcon, text('Create Campaign', { size: 24, weight: 'Bold', colorVar: 'text' })].filter(Boolean), { gap: 12 });
    const stepper = instOf('Stepper', { 'Total Steps': '3' });
    if (stepper) {
      try {
        const labels = stepper.findAll(n => n.type === 'TEXT');
        if (labels[0]) labels[0].characters = 'Campaign Details';
        if (labels[1]) labels[1].characters = 'Creatives';
        if (labels[2]) labels[2].characters = 'Targeting';
      } catch (e) {}
    }
    body.appendChild(pageHeaderRow(title, stepper));

    // Creatives card
    const headerRow = row([
      text('Creatives', { size: 18, weight: 'Semi Bold', colorVar: 'text' }),
      btn('+ Add Ad', 'Secondary', 'Medium')
    ], { gap: 16, stretch: true, justify: 'SPACE_BETWEEN' });

    // Ad group block
    const agRow = row([
      field('Ad Group 1', inputField('One Size Campaign', 'With Value', 'Large')),
      field('Ad Rotation Strategy', dd('Conversion Optimization', 'Large')),
    ], { gap: 16, stretch: true });
    agRow.children.forEach(ch => ch.layoutGrow = 1);

    const agHelp = text('(Ads in this group must all be the same dimension.)', { size: 12, colorVar: 'textTer' });

    // Ad 1 (Variation) sub-card
    const adRow = row([
      field('Ad 1', inputField('HTML Ad', 'With Value', 'Large')),
      field('Ad 1 (Variation)', inputField('HTML Creative - Welcome', 'With Value', 'Large')),
    ], { gap: 16, stretch: true });
    adRow.children.forEach(ch => ch.layoutGrow = 1);

    const htmlBox = frame({
      name: 'HTML Code', layout: 'VERTICAL', counterSizing: 'AUTO',
      gap: 6, padding: 16, fillVar: 'bgDark', radius: 6
    });
    htmlBox.layoutAlign = 'STRETCH';
    htmlBox.appendChild(text('Ad Setup (HTML)', { size: 12, colorVar: 'textLight', weight: 'Medium' }));
    htmlBox.appendChild(text('1   <p>Welcome to our new retail brand!</p>', { size: 13, color: { r: 0.6, g: 0.95, b: 0.6 } }));

    const approvalBox = frame({
      name: 'Approval Required', layout: 'HORIZONTAL', counterSizing: 'AUTO',
      gap: 12, padding: 16, fillVar: 'bgLight', radius: 6, borderVar: 'border', align: 'CENTER'
    });
    approvalBox.layoutAlign = 'STRETCH';
    if (C.ic_info) approvalBox.appendChild(C.ic_info.createInstance());
    approvalBox.appendChild(col([
      text('Creative Approval Required', { size: 13, weight: 'Semi Bold', colorVar: 'text' }),
      text('Your ad requires manual creative approval from specific platform pathways. (Manual Process)', { size: 12, colorVar: 'textSec' })
    ], { gap: 4, grow: true }));

    const adVariationCard = frame({
      name: 'Ad 1 (Variation)', layout: 'VERTICAL', counterSizing: 'AUTO',
      gap: 16, padding: 20, fillVar: 'bg', radius: 8, borderVar: 'border'
    });
    adVariationCard.layoutAlign = 'STRETCH';
    [
      text('Ad 1 (Variation)', { size: 14, weight: 'Semi Bold', colorVar: 'text' }),
      adRow, htmlBox, approvalBox
    ].forEach(n => adVariationCard.appendChild(n));

    const addVarBtn = btn('+ Add Variation', 'Secondary', 'Medium');
    const addVarRow = row([addVarBtn].filter(Boolean), { gap: 12, stretch: true, justify: 'CENTER' });

    const adGroupCard = frame({
      name: 'Ad Group 1', layout: 'VERTICAL', counterSizing: 'AUTO',
      gap: 16, padding: 20, fillVar: 'bgLight', radius: 8, borderVar: 'border'
    });
    adGroupCard.layoutAlign = 'STRETCH';
    [agRow, agHelp, adVariationCard, addVarRow].forEach(n => adGroupCard.appendChild(n));

    // Ad Group 2 (collapsed)
    const ag2 = frame({
      name: 'Ad Group 2', layout: 'HORIZONTAL', counterSizing: 'AUTO',
      gap: 12, padding: 20, fillVar: 'bgLight', radius: 8, borderVar: 'border', align: 'CENTER'
    });
    ag2.layoutAlign = 'STRETCH';
    ag2.primaryAxisAlignItems = 'SPACE_BETWEEN';
    ag2.appendChild(text('Ad Group 2', { size: 14, weight: 'Semi Bold', colorVar: 'text' }));

    body.appendChild(card([headerRow, adGroupCard, ag2]));
    body.appendChild(row([btn('Save and Continue', 'Primary', 'Large')], { gap: 12, justify: 'MAX', stretch: true }));

    return root;
  }

  // Build all 5 modules
  figma.notify('Building modules…');
  const modules = [];
  try { modules.push(await buildAdvertisersList()); } catch (e) { figma.notify('M1 failed: ' + e.message); console.error(e); }
  try { modules.push(await buildCreateAdvertiser()); } catch (e) { figma.notify('M2 failed: ' + e.message); console.error(e); }
  try { modules.push(await buildCampaignListing()); } catch (e) { figma.notify('M3 failed: ' + e.message); console.error(e); }
  try { modules.push(await buildCreateCampaignDetails()); } catch (e) { figma.notify('M4 failed: ' + e.message); console.error(e); }
  try { modules.push(await buildCreateCampaignCreatives()); } catch (e) { figma.notify('M5 failed: ' + e.message); console.error(e); }

  // Place each module: if a frame with the same name already exists on the
  // current page, capture its position, remove it, and drop the new module
  // at the same x/y (replace-in-place). Otherwise lay them out side-by-side.
  let nextX = 0;
  const gap = 80;
  for (const m of modules) {
    if (!m) continue;

    const existing = figma.currentPage.findOne(
      n => n.type === 'FRAME' && n.name === m.name && n !== m
    );

    if (existing) {
      const { x, y } = existing;
      try { existing.remove(); } catch (e) { /* ignore */ }
      figma.currentPage.appendChild(m);
      m.x = x;
      m.y = y;
    } else {
      figma.currentPage.appendChild(m);
      m.x = nextX;
      m.y = 0;
      nextX += m.width + gap;
    }
  }

  if (modules.length) {
    figma.viewport.scrollAndZoomIntoView(modules);
    figma.notify(`Built ${modules.length} module${modules.length === 1 ? '' : 's'}.`);
  } else {
    figma.notify('No modules were built. Check console for errors.');
  }

  figma.closePlugin();
})();
