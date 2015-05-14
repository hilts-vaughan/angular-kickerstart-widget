# angular-kickstarter-widget

A small, configurable site widget for Kickstarter campaign runners to embed in their site for managing pledges.

# About

**KickWidget was developed by Vaughan Hilts...** as a project to be more familiar with vanilla JavaScript development and AngularJS development. It allows you to generate a widget based on your Kickstarter project using reward data and data pulled from the Kickstarter campaign. The project uses all modern HTML5 technologies but the widget itself uses only barebones JavaScript, with no dependencies such as JavaScript. This makes it a lot easier to embed on webpages that would normally be very simple and don't need the bloat of something like jQuery inside of them.

If you have a feature request or bug report, please create an issue for me on GitHub and I will get back to you when I can.

# Using

[Check out the demo page here](http://hilts-vaughan.github.io/angular-kickstarter-widget) to generate a project file and then follow the following steps:

1. Include the `widget.html` markup where you want the widget to go.
2. Include the `widget.css` in your page, also make sure you have the `add_on.html` and `reward_row.html` in the active directory of where the JavaScript will be loading form.
You can edit this in the library if you'd like
3. Include the `KickWidget.js` file in your page
4. Create your widget using the code snippet below

`		widget = new KickWidget('kickwidget-container', jsonProject);`
`widget.init();`

The JSON project is the file you downloaded from the setup demo. You can load this in using JSON.parse or however you would like. You'll get a great widget like the one pictured below:

![](https://raw.githubusercontent.com/hilts-vaughan/angular-kickstarter-widget/master/res/demo.PNG)

