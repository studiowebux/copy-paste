waitfor() {
    while true; do 
        if [ -f file.txt ]; then
            break;
        else
            echo "File does not exist."
        fi
        echo "Wait 10 seconds..."
        sleep 10
        echo "Retrying..."
    done
}