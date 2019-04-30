export default function toggleFullScreen() {
	const doc = window.document
	const docEl = doc.documentElement

	const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen
	const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen

	if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
		requestFullScreen.call(docEl)
		window.screen.orientation.lock("landscape-primary").catch(err => console.error(err))
	}
	else {
		cancelFullScreen.call(doc)
	}
}
