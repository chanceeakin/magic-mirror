if [ -z "$DISPLAY" ]; then #If not set DISPLAY is SSH remote or tty
	export DISPLAY=:0 # Set by defaul display
fi
electron --js-flags="--harmony-async-await" js/electron.js $1
