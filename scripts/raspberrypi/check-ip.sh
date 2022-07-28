#!/bin/sh

set -e

currentIp=$(host myip.opendns.com resolver1.opendns.com | \
            grep "myip.opendns.com has address" | \
            cut -d' ' -f4) 

savedIp=$(cat /tmp/last_public_ip.log)

if [ "$savedIp" = "" ] ;
then
    echo "Saved IP is undefined" | tee /dev/kmsg
    exit 1
fi

if [ "$currentIp" = "" ] ;
then
    echo "Current IP is undefined" | tee /dev/kmsg
    exit 1
fi

echo "[check-ip.sh] Current Public IP: '$currentIp' vs. '$savedIp'" | tee /dev/kmsg
if [ "$currentIp" != "$savedIp" ]; then
    echo $currentIp > /tmp/last_public_ip.log
    echo "Public IP has changed: ${savedIp} -> ${currentIp}" | \
    mailx -v \
        -s 'Raspberry PI public Ip has changed !' \
        -r "$HOSTNAME<no-reply@changeme.com>" \
        your-email@changeme.com your-second-email@changeme.com
    echo "[check-ip.sh] Notification sent !" | tee /dev/kmsg
fi