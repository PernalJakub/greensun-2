# Frontend Dockerfile dla GreenSun
FROM nginx:alpine

# Kopiuj pliki statyczne
COPY index.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY data/ /usr/share/nginx/html/data/
COPY media/ /usr/share/nginx/html/media/

# Kopiuj pliki SEO
COPY sitemap.xml /usr/share/nginx/html/
COPY robots.txt /usr/share/nginx/html/

# Opcjonalnie: konfiguracja nginx dla SPA
RUN echo 'server { \
    listen 8080; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 8080
