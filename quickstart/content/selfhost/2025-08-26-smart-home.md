+++
title = "Self-Host"
date = 2025-08-26 08:43:32
draft = false
+++

Smart-Home:

 - Cloud documents - Next cloud
 - Pictures - Immich
 - Bookmarks, RSS reader - Karakeep
 - PiHole - network blocking
 - NetBox - management of the network clients (if you have 2 places you visit)
 - Jellyfin - movies, shows, streaming
 - Paperless - ??
 - Samba - dockur samba  https://github.com/dockur/samba

 - Vaultwarden
 - Nginx Proxy manager or Traefik

Setup
 - You can have them as different docker images
 - YOu can have different computers with them

Install docker
NAS with samba (open media vault?) should be separate because of network and setup shananingans?

```
version: "3.9"

services:

  ### 1. Nextcloud (cloud documents)
  nextcloud:
    image: nextcloud
    container_name: nextcloud
    ports:
      - "8080:80"
    volumes:
      - nextcloud_data:/var/www/html
    environment:
      - MYSQL_PASSWORD=nextcloudpass
      - MYSQL_DATABASE=nextcloud
      - MYSQL_USER=nextcloud
      - MYSQL_HOST=nextcloud_db
    depends_on:
      - nextcloud_db
    restart: unless-stopped

  nextcloud_db:
    image: mariadb
    container_name: nextcloud_db
    environment:
      - MYSQL_ROOT_PASSWORD=supersecure
      - MYSQL_DATABASE=nextcloud
      - MYSQL_USER=nextcloud
      - MYSQL_PASSWORD=nextcloudpass
    volumes:
      - nextcloud_db:/var/lib/mysql
    restart: unless-stopped

  ### 2. Immich (photo storage)
  immich_server:
    image: ghcr.io/immich-app/immich-server:release
    container_name: immich_server
    depends_on:
      - immich_db
      - redis
    environment:
      - DB_URL=postgresql://immich:immichpass@immich_db:5432/immich
    ports:
      - "2283:3001"
    volumes:
      - immich_data:/usr/src/app/upload
    restart: unless-stopped

  immich_db:
    image: postgres:15
    container_name: immich_db
    environment:
      - POSTGRES_USER=immich
      - POSTGRES_PASSWORD=immichpass
      - POSTGRES_DB=immich
    volumes:
      - immich_db:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis
    container_name: redis
    restart: unless-stopped

  ### 3. Karakeep (bookmarks/RSS)
  karakeep:
    image: karakeep/karakeep:latest
    container_name: karakeep
    ports:
      - "8085:8080"
    volumes:
      - karakeep_data:/data
    restart: unless-stopped

  ### 4. PiHole (DNS blocking)
  pihole:
    image: pihole/pihole:latest
    container_name: pihole
    ports:
      - "53:53/tcp"
      - "53:53/udp"
      - "81:80"
    environment:
      - TZ=Europe/Berlin
      - WEBPASSWORD=admin
    volumes:
      - pihole_etc:/etc/pihole
      - pihole_dnsmasq:/etc/dnsmasq.d
    cap_add:
      - NET_ADMIN
    restart: unless-stopped

  ### 5. NetBox (network documentation)
  netbox:
    image: netboxcommunity/netbox:latest
    container_name: netbox
    ports:
      - "8000:8080"
    volumes:
      - netbox_data:/etc/netbox
    restart: unless-stopped

  ### 6. Jellyfin (media streaming)
  jellyfin:
    image: jellyfin/jellyfin
    container_name: jellyfin
    ports:
      - "8096:8096"
    volumes:
      - jellyfin_config:/config
      - jellyfin_cache:/cache
      - media:/media
    restart: unless-stopped

  ### 7. Portainer
  portainer:
    image: portainer/portainer-ce:latest
    container_name: portainer
    ports:
      - "9000:9000"
      - "9443:9443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - portainer_data:/data
    restart: unless-stopped

volumes:
  nextcloud_data:
  nextcloud_db:
  immich_data:
  immich_db:
  karakeep_data:
  pihole_etc:
  pihole_dnsmasq:
  netbox_data:
  jellyfin_config:
  jellyfin_cache:
  media:
  portainer_data:
```

docker-compose up -d

Provide Apache Http with Index

Access services:
 - Portainer → http://localhost:9000
 - Nextcloud → http://localhost:8080
 - Immich → http://localhost:2283
 - Karakeep → http://localhost:8085
 - PiHole → http://localhost:81
 - NetBox → http://localhost:8000
 - Jellyfin → http://localhost:8096

# Reverse proxy
Us it to route domain names to services (e.g. photos.yourdomain.com → Immich)
