question() {
    while true; do
        read -p "my fabulous question [N/y]" readme
        case $readme in
            [Yy]* ) break;;
            [Nn]* ) exit;;
            * ) exit;;
        esac
    done
}