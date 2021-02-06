# NENO
 
## Example to run NENO with a TLS certificate 

```
npm run build \
&& node dist/index.js --use-https \
--cert-path /etc/letsencrypt/live/www.my.domain/cert.pem \
--cert-key-path /etc/letsencrypt/live/www.my.domain/privkey.pem'
```