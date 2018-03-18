#/bin/bash
currdate=`date "+%Y-%m-%d_%H.%M"`
BACKUPDIR=~/backup/hsqldb

mkdir -p $BACKUPDIR/$currdate

sudo service thingsboard stop
if [ $? -ne 0 ]; then
        echo "Failed to stop Thingsboard!"
        exit
fi

# Instructions for installing and configuring sqltool: https://stackoverflow.com/a/49197571/603901
hsqldb-sqltool --sql="BACKUP DATABASE TO '$BACKUPDIR/$currdate/' BLOCKING AS FILES;" thingsboard
if [ $? -ne 0 ]; then
        echo "Failed to start sqltool"
        exit
fi

sudo service thingsboard start
if [ $? -ne 0 ]; then
        echo "Failed to start Thingsboard!"
        exit
fi

tar cf $BACKUPDIR/$currdate.tar.bz2 --use-compress-prog=pbzip2 $BACKUPDIR/$currdate/ && rm -rf $BACKUPDIR/$currdate/

# Only keep last 30 days of backups
find $BACKUPDIR -mtime +30 -exec rm {} \;
