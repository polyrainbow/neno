max=100
for i in `seq 1 $max`
do
    curl -sL https://en.wikipedia.org/wiki/Special:Random | grep '<title>' | grep -o -P '(?<=\<title\>)[^\r^\n]*(?= - Wikipedia)'
    sleep 4s
done
