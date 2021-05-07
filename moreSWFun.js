

/**
 * Zajímavé nápady
 */
class XXName {
	/**visibility(el, visibility) {
		el.style.disply = visibility ? '' : null;
	}, //TODO ? needed ???*/

	/**css(el, conf) {
		if (!conf) {
			return;
		}

		for (let s in conf) {
			el.style[s] = conf[s];
		}
	},*/
}

const SW = {
	/**
	 * Starts whole application //TODO popis
	 * @param fun
	 */
	start: (fun) => {
		if (document.readyState === 'loading') {
			document.addEventListener("DOMContentLoaded", () => {
				fun();
			});
		} else {
			fun();
		}
	},

	/**
	 * Gets and returns token from url in format
	 * url?{tokenName}={token}
	 *
	 * @param {string} tokenName - Name of wanted token
	 */
	getUrlToken: (tokenName) => {
		const urlParams = new URLSearchParams(document.location.search.substring(1));
		return urlParams.get(tokenName);
	},

	/**
	 * Čte položku z localStorage.
	 *
	 * Položka je automaticky konvertovaná pomocí JSON.parse().
	 *
	 * @param {string} key - Klíč v localStorage
	 * @param {*} defaultValue - Výchozí hodnota pro případ, že zadaný klíč v localStorage zatím neexistuje
	 * @return {*} Načtená nebo výchozí hodnota
	 */
	getLocalStorageItem(key, defaultValue) {
		const item = localStorage.getItem(key);
		return item != null ? JSON.parse(item) : defaultValue;
	},

	/**
	 * Saves
	 * //TODO popis
	 * @param key
	 * @param data
	 */
	setLocalStorageItem(key, data) {
		localStorage.setItem(
			key,
			JSON.stringify(data)
		);
	},

	/**
	 * Object for math calculations and functions
	 */
	Math: {}
};


Object.assign(SW.Math, {
	randomNumber(multiplier) {
		return Math.floor(Math.random() * multiplier);
	},

	randomArrayItem(array) {
		const randomIndex = S.randomNumber(array.length);
		return array[randomIndex];
	},

	/**
	 * Vypočítává procento
	 *
	 * @param {int} numerator - Čitatel
	 * @param {int} denominator - Jmenovatel
	 * @return {int} Zlomek čitatel/jmenovatel vyjádřený jako procento
	 */
	calculatePercentage(numerator, denominator) {
		return Math.floor(100 * numerator / denominator) || 0;
	}
});

/**
 * Merge 2 array with objects based on their id
 * @param array1
 * @param array2
 * @return {*}
 */
SW.mergeArrayObjectsById = (array1, array2) => {
	array1 = array1.map(item => {
		const word = array2.find(word => word.id === item.id);
		return {...item, ...word};
	});
	return array1;
};

SW.validateEmail = (email) => {
	if (!email.contains('@')) {
		return 'Email is now valid';
	}

	const emailSplit = email.split('@'); //TODO change to regular expression

	if (emailSplit[0].length === 0) {
		return 'Email length before @ cannot be 0';
	}

	if (emailSplit[2].length === 0) {
		return 'Email length after @ cannot be 0';
	}

	if (!emailSplit[2].contains('.')) {
		return 'Email without suffix does not exist';
	}

	return true;
}