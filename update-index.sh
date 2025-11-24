#!/bin/bash

# Create new index.html with module imports instead of inline scripts

# Part 1: Lines 1-45 (head, before first large script block)
sed -n '1,45p' index.html > index-new.html

# Add module script imports
cat >> index-new.html << 'MODULES'
  <!-- JavaScript Modules -->
  <script src="./js/theme.js"></script>
  <script src="./js/language.js"></script>
MODULES

# Part 2: Lines 437-438 (closing script tag and before Meta Pixel)
sed -n '437,438p' index.html >> index-new.html

# Part 3: Lines 439-1024 (Meta Pixel to before main script)
sed -n '439,1024p' index.html >> index-new.html

# Add remaining module imports before closing body
cat >> index-new.html << 'MODULES2'
  <!-- Core JavaScript Modules -->
  <script src="./js/navbar.js"></script>
  <script src="./js/hero.js"></script>
  <script src="./js/utils.js"></script>
  <script src="./js/gallery.js"></script>
  <script src="./js/form.js"></script>
  <script src="./js/main.js"></script>

MODULES2

# Part 4: Lines 2165-2868 (modals and legal content to end)
sed -n '2165,$p' index.html >> index-new.html

# Replace old index.html
mv index.html index.html.with-inline-js
mv index-new.html index.html

echo "✅ Updated index.html with module imports"
echo "📊 New file size: $(wc -l < index.html) lines (was 2868 lines)"
echo "📉 Reduced by: $((2868 - $(wc -l < index.html))) lines"

