#!/bin/bash

# Fix gallery.js - remove duplicate declaration and fix currentLanguage reference
sed -i '' '5d' gallery.js
sed -i '' 's/const lang = currentLanguage || '\''pl'\'';/const lang = (window.languageModule ? window.languageModule.currentLanguage : null) || '\''pl'\'';/' gallery.js

# Fix form.js - check for duplicate declarations
if grep -q "^function initContactForm() {$" form.js; then
  # Count how many times the function is declared
  count=$(grep -c "^function initContactForm() {$" form.js)
  if [ "$count" -gt 1 ]; then
    echo "Found $count declarations of initContactForm in form.js - fixing..."
    # Keep only first occurrence
    awk '/^function initContactForm\(\) \{$/ && !found {found=1; print; next} /^function initContactForm\(\) \{$/ && found {next} 1' form.js > form.js.tmp
    mv form.js.tmp form.js
  fi
fi

# Similarly check showNotification
if grep -q "^function showNotification" form.js; then
  count=$(grep -c "^function showNotification" form.js)
  if [ "$count" -gt 1 ]; then
    echo "Found $count declarations of showNotification in form.js - fixing..."
    awk '/^function showNotification/ && !found {found=1; print; next} /^function showNotification/ && found {next} 1' form.js > form.js.tmp
    mv form.js.tmp form.js
  fi
fi

echo "✅ Fixed gallery.js and form.js"
ls -lh gallery.js form.js

