## open crontab file

```sh
crontab -e
```

```sh
30 * * * * curl --location --request GET '<server>/common/webhook-user-cache-update'

every after 30 minutes
```

## to stop cron job

```sh
crontab -r
```

## to check running cron jobs

```sh
crontab -l
```
