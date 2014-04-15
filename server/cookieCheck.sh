#!/bin/bash

opensslCommand=${3:-openssl}

function decodeBase64UrlSafe() {
    unpaddedBase64=$(echo "$1"  | tr "-" "+" | tr "_" "/")
    unpaddedLength=${#unpaddedBase64}
    paddedLength=$(echo "$unpaddedLength + (4 - $unpaddedLength % 4) % 4" | bc)
    paddedBase64=$(printf -vch "%-${paddedLength}s" "$unpaddedBase64"; printf "%s" "${ch// /=}")
    paddedChunkedBase64=$(echo "$paddedBase64" | sed -r 's/(.{77})/\1\n/g')

    #echo "$paddedChunkedBase64" | $opensslCommand enc -d -base64
    echo $paddedChunkedBase64
}



decodeBase64UrlSafe "$(echo "$1" | cut -d "." -f 1)" | echo $2
exit
# signatureFile=$(mktemp)

# decodeBase64UrlSafe "$(echo "$1" | cut -d "." -f 2)" > "$signatureFile"
# cat "$signatureFile" > openout
# decodeBase64UrlSafe "$(echo "$1" | cut -d "." -f 1)" | $opensslCommand dgst -sha256 -verify $2 -signature "$signatureFile" 2>/dev/null
# returnValue=$?

# rm "$signatureFile"
#
#

# exit $returnValue
# exit
