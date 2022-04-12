var Globals = {
	_settingsContent: null,
	_settingsDialog: null,
	getSettingsContent: function() {
		if (!Globals._settingsContent) {
			var base_url = 'http://' + wb_builder.siteDomain + '/';
			var content = $('<div>').append('<p><strong>Page URL:</strong> <a href="https://www.nbg.gr/" target="_blank">https://www.nbg.gr/</a></p>'
					+ '<p><strong>Webhook endpoint URL:</strong><br />'
					+ '<pre>' + base_url + '0/store-callback/Simplify' + '</pre></p>'
					+ '<p>Add event type "checkout.session.completed" for webhook endpoint.</p>');
			Globals._settingsContent = content.html();
		}
		return Globals._settingsContent;
	},
	getSettingsDialog: function() {
		if (!Globals._settingsDialog) {
			var dlg = new WB_Dialog(__('Settings'));
			dlg.setContent(Globals.getSettingsContent());
			dlg.removeAllButtons();
			dlg.addButton(__('Close'), function() {
				dlg.setVisible(false);
			}, false, 'btn-default');
			Globals._settingsDialog = dlg;
		}
		return Globals._settingsDialog;
	},
	getDefaultStyles: function(isStore) {
		var styles = {
			button_color: '#32325d',
			button_border: {
				color: '#337fbd',
				style: 'none',
				weight: 1,
				css: { border: '1px none #337fbd' },
				cssRaw: 'border: 1px none #337fbd'
			},
			logo: 'simplify.svg',
			font_family: 'Arial',
			font_size: 12,
			label_color: '#9d9dbd'
		};
		return isStore ? styles : $.extend(true, styles, {
			button_label: __('Pay with %s').replace('%s', ''),
			showlogo: true,
			logo_width: 110,
			button_padding: 4
		});
	},
	getLogosList: function() {
		return [
			{id: 'simplify_black.svg', name: 'coloured'},
			{id: 'simplify_color.svg', name: 'black'},
			{id: 'simplify_white.svg', name: 'white', backgroundColor: '#000000'}
		];
	}
};

ElementRegister.registerPaymentGateway({
	name: 'Simplify',
	id: 'simplify',
	pageUrl: 'https://www.nbg.gr/',
	keyField: __('Publishable Key'),
	keyFieldId: 'publishable_key',
	keyField2: __('Secret Key'),
	keyField2Id: 'secret_key',
	keyField3: __('Webhook Secret'),
	keyField3Id: 'webhook_secret',
	titleFieldId: 'label',
	nameFieldId: 'description,description2',
	priceFieldId: 'amount',
	currencyFieldId: 'currency',
	globalVars: ['publishable_key', 'secret_key', 'webhook_secret'],
	useStylesInStoreCart: true,
	styleTabDef: PluginWrapper.paymentGatewayStyleTabDef(Globals.getLogosList(), 'simplify', true),
	settingsTabDef: Globals.getSettingsContent(),
	defaultStyles: Globals.getDefaultStyles(true)
});
PluginWrapper.registerPlugin('simplify', {
	name: 'Simplify',
	element: {
		minSize: {width: 68, height: 34},
		defaultSize: {width: 160, height: 81},
		resizable: true
	},
	properties: PluginWrapper.paymentGatewayStylePropertiesDef([
		{id: 'publishable_key', type: 'SimplifyPublishableKey', helpText: __('Your publishable key'),
			get: function(data) { return data.content.publishable_key; },
			set: function(value, data) {
				data.content.publishable_key = value;
			}
		},
		{id: 'secret_key', type: 'SimplifySecretKey', helpText: __('Your secret key'),
			get: function(data) { return data.content.secret_key; },
			set: function(value, data) {
				data.content.secret_key = value;
			}
		},
		{id: 'description', type: 'SimplifyDescription', helpText: __('The name of the goods. Cannot contain special symbols'),
			get: function(data) { return data.content.description; },
			set: function(value, data) {
				data.content.description = value;
			}
		},
		{id: 'amount', type: 'SimplifyAmount',
			get: function(data) { return data.content.amount; },
			validate: function(value) {
				if (/^[\d.,]+$/.test(value)) {
					return '';
				} else {
					return (__('Incorrect format'));
				}
			},
			set: function(value, data) {
				data.content.amount = value;
			}
		},
		{id: 'currency', type: 'SimplifyCurrency',
			get: function(data) { return data.content.currency; },
			set: function(value, data) {
				data.content.currency = value;
			}
		},
		{id: 'description2', type: 'SimplifyDescription2',
			get: function(data) { return data.content.description2; },
			set: function(value, data) {
				data.content.description2 = value;
			}
		},
	],Globals.getLogosList(), 'simplify'),
	propertyDialog: {
		noScroll: true,
		tabs: [
			{children: [
				{type: 'VerticalLayout', spacing: 15, children: [
					{type: 'HorizontalLayout', css: {marginTop: 15}, children: [
						{type: 'VerticalLayout', children: [
							{type: 'Label', text: __('Publishable Key'), helpText: __('Your publishable key')},
							{type: 'TextField', id: 'publishable_key'}
						]},
						{type: 'VerticalLayout', children: [
							{type: 'Label', text: __('Secret Key'), helpText: __('Your secret key')},
							{type: 'TextField', id: 'secret_key'}
						]}
					]},
					{type: 'HorizontalLayout', columnWeights: [6, 3, 3], css: {marginTop: 15}, children: [
						{type: 'VerticalLayout', children: [
							{type: 'Label', text: __('Item Name')},
							{type: 'TextField', id: 'description'}
						]},
						{type: 'VerticalLayout', children: [
							{type: 'Label', text: __('Amount')},
							{type: 'TextField', id: 'amount'}
						]},
						{type: 'VerticalLayout', children: [
							{type: 'Label', text: __('Currency')},
							{type: 'DropdownBox', id: 'currency', options: [
								{id: '#USD', name: 'USD', value: 'USD'},
								{id: '#EUR', name: 'EUR', value: 'EUR'},
								{id: '#AED', name: 'AED', value: 'AED'},
								{id: '#AFN', name: 'AFN', value: 'AFN'},
								{id: '#ALL', name: 'ALL', value: 'ALL'},
								{id: '#AMD', name: 'AMD', value: 'AMD'},
								{id: '#ANG', name: 'ANG', value: 'ANG'},
								{id: '#AOA', name: 'AOA', value: 'AOA'},
								{id: '#AUD', name: 'AUD', value: 'AUD'},
								{id: '#AWG', name: 'AWG', value: 'AWG'},
								{id: '#AZN', name: 'AZN', value: 'AZN'},
								{id: '#BAM', name: 'BAM', value: 'BAM'},
								{id: '#BBD', name: 'BBD', value: 'BBD'},
								{id: '#BDT', name: 'BDT', value: 'BDT'},
								{id: '#BGN', name: 'BGN', value: 'BGN'},
								{id: '#BIF', name: 'BIF', value: 'BIF'},
								{id: '#BMD', name: 'BMD', value: 'BMD'},
								{id: '#BND', name: 'BND', value: 'BND'},
								{id: '#BOB', name: 'BOB', value: 'BOB'},
								{id: '#BRL', name: 'BRL', value: 'BRL'},
								{id: '#BSD', name: 'BSD', value: 'BSD'},
								{id: '#BWP', name: 'BWP', value: 'BWP'},
								{id: '#BZD', name: 'BZD', value: 'BZD'},
								{id: '#CAD', name: 'CAD', value: 'CAD'},
								{id: '#CDF', name: 'CDF', value: 'CDF'},
								{id: '#CHF', name: 'CHF', value: 'CHF'},
								{id: '#CLP', name: 'CLP', value: 'CLP'},
								{id: '#CNY', name: 'CNY', value: 'CNY'},
								{id: '#COP', name: 'COP', value: 'COP'},
								{id: '#CRC', name: 'CRC', value: 'CRC'},
								{id: '#CVE', name: 'CVE', value: 'CVE'},
								{id: '#CZK', name: 'CZK', value: 'CZK'},
								{id: '#DJF', name: 'DJF', value: 'DJF'},
								{id: '#DKK', name: 'DKK', value: 'DKK'},
								{id: '#DOP', name: 'DOP', value: 'DOP'},
								{id: '#DZD', name: 'DZD', value: 'DZD'},
								{id: '#EGP', name: 'EGP', value: 'EGP'},
								{id: '#ETB', name: 'ETB', value: 'ETB'},
								{id: '#FJD', name: 'FJD', value: 'FJD'},
								{id: '#FKP', name: 'FKP', value: 'FKP'},
								{id: '#GBP', name: 'GBP', value: 'GBP'},
								{id: '#GEL', name: 'GEL', value: 'GEL'},
								{id: '#GIP', name: 'GIP', value: 'GIP'},
								{id: '#GMD', name: 'GMD', value: 'GMD'},
								{id: '#GNF', name: 'GNF', value: 'GNF'},
								{id: '#GTQ', name: 'GTQ', value: 'GTQ'},
								{id: '#GYD', name: 'GYD', value: 'GYD'},
								{id: '#HKD', name: 'HKD', value: 'HKD'},
								{id: '#HNL', name: 'HNL', value: 'HNL'},
								{id: '#HRK', name: 'HRK', value: 'HRK'},
								{id: '#HTG', name: 'HTG', value: 'HTG'},
								{id: '#HUF', name: 'HUF', value: 'HUF'},
								{id: '#IDR', name: 'IDR', value: 'IDR'},
								{id: '#ILS', name: 'ILS', value: 'ILS'},
								{id: '#INR', name: 'INR', value: 'INR'},
								{id: '#ISK', name: 'ISK', value: 'ISK'},
								{id: '#JMD', name: 'JMD', value: 'JMD'},
								{id: '#JPY', name: 'JPY', value: 'JPY'},
								{id: '#KES', name: 'KES', value: 'KES'},
								{id: '#KGS', name: 'KGS', value: 'KGS'},
								{id: '#KHR', name: 'KHR', value: 'KHR'},
								{id: '#KMF', name: 'KMF', value: 'KMF'},
								{id: '#KRW', name: 'KRW', value: 'KRW'},
								{id: '#KYD', name: 'KYD', value: 'KYD'},
								{id: '#KZT', name: 'KZT', value: 'KZT'},
								{id: '#LAK', name: 'LAK', value: 'LAK'},
								{id: '#LBP', name: 'LBP', value: 'LBP'},
								{id: '#LKR', name: 'LKR', value: 'LKR'},
								{id: '#LRD', name: 'LRD', value: 'LRD'},
								{id: '#LSL', name: 'LSL', value: 'LSL'},
								{id: '#MAD', name: 'MAD', value: 'MAD'},
								{id: '#MDL', name: 'MDL', value: 'MDL'},
								{id: '#MGA', name: 'MGA', value: 'MGA'},
								{id: '#MKD', name: 'MKD', value: 'MKD'},
								{id: '#MMK', name: 'MMK', value: 'MMK'},
								{id: '#MNT', name: 'MNT', value: 'MNT'},
								{id: '#MOP', name: 'MOP', value: 'MOP'},
								{id: '#MRO', name: 'MRO', value: 'MRO'},
								{id: '#MUR', name: 'MUR', value: 'MUR'},
								{id: '#MVR', name: 'MVR', value: 'MVR'},
								{id: '#MWK', name: 'MWK', value: 'MWK'},
								{id: '#MXN', name: 'MXN', value: 'MXN'},
								{id: '#MYR', name: 'MYR', value: 'MYR'},
								{id: '#MZN', name: 'MZN', value: 'MZN'},
								{id: '#NAD', name: 'NAD', value: 'NAD'},
								{id: '#NGN', name: 'NGN', value: 'NGN'},
								{id: '#NIO', name: 'NIO', value: 'NIO'},
								{id: '#NOK', name: 'NOK', value: 'NOK'},
								{id: '#NPR', name: 'NPR', value: 'NPR'},
								{id: '#NZD', name: 'NZD', value: 'NZD'},
								{id: '#PAB', name: 'PAB', value: 'PAB'},
								{id: '#PEN', name: 'PEN', value: 'PEN'},
								{id: '#PGK', name: 'PGK', value: 'PGK'},
								{id: '#PHP', name: 'PHP', value: 'PHP'},
								{id: '#PKR', name: 'PKR', value: 'PKR'},
								{id: '#PLN', name: 'PLN', value: 'PLN'},
								{id: '#PYG', name: 'PYG', value: 'PYG'},
								{id: '#QAR', name: 'QAR', value: 'QAR'},
								{id: '#RON', name: 'RON', value: 'RON'},
								{id: '#RSD', name: 'RSD', value: 'RSD'},
								{id: '#RUB', name: 'RUB', value: 'RUB'},
								{id: '#RWF', name: 'RWF', value: 'RWF'},
								{id: '#SAR', name: 'SAR', value: 'SAR'},
								{id: '#SBD', name: 'SBD', value: 'SBD'},
								{id: '#SCR', name: 'SCR', value: 'SCR'},
								{id: '#SEK', name: 'SEK', value: 'SEK'},
								{id: '#SGD', name: 'SGD', value: 'SGD'},
								{id: '#SHP', name: 'SHP', value: 'SHP'},
								{id: '#SLL', name: 'SLL', value: 'SLL'},
								{id: '#SOS', name: 'SOS', value: 'SOS'},
								{id: '#SRD', name: 'SRD', value: 'SRD'},
								{id: '#STD', name: 'STD', value: 'STD'},
								{id: '#SVC', name: 'SVC', value: 'SVC'},
								{id: '#SZL', name: 'SZL', value: 'SZL'},
								{id: '#THB', name: 'THB', value: 'THB'},
								{id: '#TJS', name: 'TJS', value: 'TJS'},
								{id: '#TOP', name: 'TOP', value: 'TOP'},
								{id: '#TRY', name: 'TRY', value: 'TRY'},
								{id: '#TTD', name: 'TTD', value: 'TTD'},
								{id: '#TWD', name: 'TWD', value: 'TWD'},
								{id: '#TZS', name: 'TZS', value: 'TZS'},
								{id: '#UAH', name: 'UAH', value: 'UAH'},
								{id: '#UGX', name: 'UGX', value: 'UGX'},
								{id: '#UYU', name: 'UYU', value: 'UYU'},
								{id: '#UZS', name: 'UZS', value: 'UZS'},
								{id: '#VND', name: 'VND', value: 'VND'},
								{id: '#VUV', name: 'VUV', value: 'VUV'},
								{id: '#WST', name: 'WST', value: 'WST'},
								{id: '#XAF', name: 'XAF', value: 'XAF'},
								{id: '#XCD', name: 'XCD', value: 'XCD'},
								{id: '#XOF', name: 'XOF', value: 'XOF'},
								{id: '#XPF', name: 'XPF', value: 'XPF'},
								{id: '#YER', name: 'YER', value: 'YER'},
								{id: '#ZAR', name: 'ZAR', value: 'ZAR'},
								{id: '#ZMW', name: 'ZMW', value: 'ZMW'}
							]}
						]}
					]},
					{type: 'VerticalLayout', css: {marginTop: 15}, children: [
						{type: 'Label', text: __('Description')},
						{type: 'TextField', id: 'description2'}
					]}
				]}
			]},
			PluginWrapper.paymentGatewayStyleTabDef(Globals.getLogosList(), 'simplify'),
		]
	},
	openAction: function (fields, data, elem) {
		var itm;
		itm = fields.currency.getItemById('#' + data.content.currency);
		fields.currency.selectItem(itm);
		fields.description.setText(data.content.description);
		fields.description2.setText(data.content.description2);
		fields.amount.setText(data.content.amount);
		fields.publishable_key.setText(data.content.publishable_key);
		fields.secret_key.setText(data.content.secret_key);
		PluginWrapper.paymentGatewayOpenAction(fields, data);
	},
	applyAction: function (fields, data, elem) {
		var itm;
		itm = fields.currency.getSelectedItem();
		data.content.currency = itm.getOriginal().value;
		data.content.description = fields.description.getText();
		data.content.description2 = fields.description2.getText();
		data.content.amount = fields.amount.getText();
		data.content.publishable_key = fields.publishable_key.getText();
		data.content.secret_key = fields.secret_key.getText();
		PluginWrapper.paymentGatewayApplyAction(fields, data);
	},
	loadAction: function (data) {
		data.content.__globalVars = ['publishable_key', 'secret_key', 'webhook_secret'];
		PluginWrapper.paymentGatewayMigrateNewVars(data, {
			label: 'button_label'
		});
		if (!data.content.description)
			data.content.description = ''; // Item Description
		if (!data.content.description2)
			data.content.description2 = '';
		if (!data.content.amount) // Item Amount
			data.content.amount = '1';
		if (!data.content.currency) // Item Currency
			data.content.currency = 'EUR'; 
		if (!data.content.publishable_key) // API
			data.content.publishable_key = '';
		if (!data.content.secret_key) // Secret
			data.content.secret_key = '';
		if (['logo_black.svg', 'logo_white.svg'].indexOf(data.content.logo) > -1) {
			data.content.logo = 'simplify_black.svg';
		}
		PluginWrapper.paymentGatewayLoadAction(data, Globals.getDefaultStyles());
	}
});