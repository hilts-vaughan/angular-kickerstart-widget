While developing a facebook page tab we have to specify ssl url of the app. 

Suppose your application is
<pre>
http://yourdomain.com/fb/app/
</pre>
<pre>
https://yourdomain.com/fb/app/ will not work in facebook if you do not have a valid ssl certificate.
</pre>
For a sandbox application buying an ssl certificate is not that prcactical.

This proxy can be used in that situation.

Create an application in heroku and find its git url from the settings page. 
It will be like 
<pre>
    git@heroku.com:your-application-name.git
</pre>

Then follow this steps

<pre>
   git clone git@github.com:manuks/proxy.git
   git remote add heroku git@heroku.com:your-application-name.git
   git push heroku master
   heroku config:set REDIRECTHOST=yourdomain.com
</pre>

This will create a nodejs application in heroku which will proxy yourdomain from an ssl domain.

You can give the following url in facebook app settings.
<pre>
https://<font color='red'>your-application-name</font>.herokuapp.com/fb/app/
</pre>
