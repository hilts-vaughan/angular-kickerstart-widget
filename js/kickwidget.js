
/**
 * Constructor for the KickWidget type
 * @param {string} element The DIV ID to inject into the DOM
 */
function KickWidget(element, options) {

  // We now have a copy of the element we plan on adding to
  this.element = document.getElementById(element);
  this.options = options;

  if(!options) {
  	throw "KickWidget cannot be created without valid options";
  }

}


/*
	Below is utility bootstrapping the actual application.
 */

KickWidget.prototype.init = function() {

	// We need to load the data and setup each tab as required
	this._setupPersonal();
	this._setupAddOns();	
	this._setupTiers();
	this._refreshDetails();


	// Grab the Kickstarter logo and change the URL to point to the project page
	var logo = document.getElementById('kickstarter-logo');
	logo.href = this.options.webData.url;

	var that = this;

	// Setup event handlers
	var yes = document.getElementById('kick-yes');
	yes.addEventListener('click', function() {
		that.located = true;
		that._refreshDetails();
		that.selectTab('ac-2');
	})

	// Setup event handlers
	var no = document.getElementById('kick-no');
	no.addEventListener('click', function() {
		this.located = false;
		that._refreshDetails();		
		that.selectTab('ac-2');		
	})

};

KickWidget.prototype._refreshDetails = function() {
	var container = document.getElementById('detail-text');

	if(this.located && this.selectedTier) {
		
		var tierCost = parseInt(this.selectedTier.amount.replace(/\D/g,''));
		var addonCosts = 0;


		var inputs = document.getElementsByTagName('input');


		for (var i = inputs.length - 1; i >= 0; i--) {
		
			var input = inputs[i];
			if(input.type === "number" &&  this._hasClass(input, 'input-quantity')) {
				var count = parseInt(input.value);
				if(!isNaN(count)) {
					addonCosts += input.cost * count;							
					if(!this.located) {
						addonCosts += input.shippingCost * count;	
					}
				}
			} // find all numeric inputs on the page part of the app
		}
		container.innerHTML = "Given your choices, this would require a pledge of $" + (addonCosts + tierCost);
	}

	else {
		container.innerHTML = "Please select a pledge and indicate your country first.";
	}

};

KickWidget.prototype.selectTab = function(tabName) {

	var tabs = ["ac-1", "ac-2", "ac-3", "ac-4"];
	tabs.forEach(function(tab) {
		var element = document.getElementById(tab);
		element.checked = false;
	});

	
	var target = document.getElementById(tabName);	
	target.checked = true;
};

KickWidget.prototype._setupPersonal = function() {
	var countrySpan = document.getElementById('country-span');
	countrySpan.innerHTML = this.options.kickwidget.country;
	return true;	
};

KickWidget.prototype._setupAddOns = function() {
		
	var that = this;

	// Setup the container
	var container_out = document.getElementById('add-on-container');
	container_out.innerHTML = "";

	this._loadFile('add_on.html', function(text) {

		that.options.kickwidget.rewards.forEach(function(addon) {

			// Inject the HTML with the file here
			var container = document.createElement('div');
			container.innerHTML = text;
			container_out.appendChild(container);

			var costHolder = that._findClass(container, 'addon-dollar-holder')
			var shippingHolder = that._findClass(container, 'addon-shipping-holder');
			var descriptionHolder = that._findClass(container,'addon-description');

			costHolder.innerHTML = "Cost: $" + addon.cost;
			shippingHolder.innerHTML = "Shipping: " + addon.shippingCost;
			descriptionHolder.innerHTML = "Name: " + addon.name;

			// We'll setup hooks for the numeric input boxes and attempt to detect changes
			// so that we can force reload the page
			var input = that._findClass(container, 'input-quantity');
			input.cost = addon.cost;
			input.shippingCost = addon.shippingCost;
			input.addEventListener('change', function() {
					that._refreshDetails();
			});

		});

	});
};

KickWidget.prototype._setupTiers = function() {
	
	var that = this;

	var container_out = document.getElementById('tiers-container');
	container_out.innerHTML = "";

	// You'll want to load the row template here
	this._loadFile("reward_row.html", function(text) {
		
		// Grab the web data rewards and pass on their data to the templates
		that.options.webData.rewards.forEach(function(reward){
		
			// Inject the HTML with the file here
			var container = document.createElement('div');
			container.innerHTML = text;
			container_out.appendChild(container);

			var costHolder = that._findClass(container, 'reward-dollar-holder');
			var descriptionElement = that._findClass(container, 'reward-description');

			costHolder.innerHTML = reward.amount;
			descriptionElement.innerHTML = reward.description;

			// Setup a handler for the button
			var pledgeButton = that._findClass(container, 'pledge-button');
			pledgeButton.tag = reward;
			pledgeButton.addEventListener('click', function() {
				that.selectedTier = this.tag;
				that._refreshDetails();			
				that.selectTab('ac-4');					
			});

		});

	});

};

KickWidget.prototype._findClass = function(element, className) {

	var foundElement = null, found;
	function recurse(element, className, found) {
	    for (var i = 0; i < element.childNodes.length && !found; i++) {
	        var el = element.childNodes[i];
	        var classes = el.className != undefined? el.className.split(" ") : [];
	        for (var j = 0, jl = classes.length; j < jl; j++) {
	            if (classes[j] == className) {
	                found = true;
	                foundElement = element.childNodes[i];
	                break;
	            }
	        }
	        if(found)
	            break;
	        recurse(element.childNodes[i], className, found);
	    }
	}
	recurse(element, className, false);
	return foundElement;
	
};


KickWidget.prototype._hasClass = function(element, cls) {
	// Does a parse of the element class name's to check for the proper class
	return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
};

KickWidget.prototype._loadFile = function(fileName, callback) {
	
	var xhr= new XMLHttpRequest();
	xhr.open('GET', fileName, true);
	xhr.onreadystatechange= function() {
    if (this.readyState!==4) return;
	    if (this.status!==200) return; // or whatever error handling you want
		callback(this.responseText);
	};
	xhr.send();	
};
