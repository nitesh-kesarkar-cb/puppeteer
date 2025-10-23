function renderTemplate(html, data) {
    let out = html;
    // Simple replacement. Extend with safe escaping as needed.
    for (const key of Object.keys(data)) {
        const placeholder = `{${key}}`;
        const value = data[key] != null ? data[key] : '';
        // Basic replace (global)
        out = out.split(placeholder).join(value);
    }
    return out;
}

module.exports = { renderTemplate };