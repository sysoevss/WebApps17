# coding=UTF-8

# !important The Following Code requires three basic HTML Files, 
# login.html, signup.html, and activate.html 
# 
# SUAS: Simple User Authentication then Session 
# User Session Management Library 
# The following code creates a memcache/datastore session manager that simply 
# tracks whether or not a user remains logged in, and mimics the 
# google "users" service to the greatest extent possible 
# 
# Copyright Andrew Tutt 2010. MIT License. 

# 
# Modified by sysoev for WebApp2017, 24.09.2017
#

from google.appengine.ext import db 
import webapp2 
from google.appengine.ext.webapp import template 

import os 
import uuid 
    
class myuser(db.Model): 
    email = db.EmailProperty() 
    username = db.StringProperty() 
    password = db.StringProperty() 
    session_id = db.StringProperty() 
    active = db.BooleanProperty(default=False)  

def updateUser(key, email, active):
    user = myuser.get(key)
    if not user:
        return
    user.email = email
    user.active = active
    user.put()

class session: 
    def __init__(self,handler): 
        """Requires a webapp requesthandler passed as a constructor""" 
        self.handler = handler 
        self.session_id = None 

    def create_user(self, email, username, password): 
        """Create a new user in the datastore""" 
        tmp = myuser(key_name=username.lower()) 
        tmp.username = username 
        tmp.email = email 
        tmp.password = password 
        tmp.active = True
        self._sync_user(tmp) 
        return tmp.key()

    def get_current_user(self): 
        """Returns the currently logged in user or "None" if no session""" 
        return self._fetch_user_by_cookie() 

    def grab_login(self, username, password): 
        """Generates a session for the user if user/pass match database""" 
        tmp = self._fetch_user_with_pass(username,password) 
        if tmp: 
            self._sync_user(tmp) 
        return tmp 

    def logout(self): 
        """Logout the logged in user""" 
        user = self._fetch_user_by_cookie() 
        if user: 
            user.session_id = None 
            user.put() 

    def _gen_session_id(self): 
        return uuid.uuid4() 

    def _sync_user(self, _user): 
        sid = str(self._gen_session_id()) 
        ssid = 'ssid=' + sid 
        self.handler.response.headers.add_header('Set-Cookie',ssid) 
        _user.session_id = sid 
        self.session_id = sid 
        _user.put() 

    def _fetch_user_by_cookie(self): 
        if not self.session_id: 
            try: 
                sid = self.handler.request.cookies['ssid'] 
            except: 
                sid = "" 
                ssid = '='.join(('ssid',sid)) 
                self.handler.response.headers.add_header('Set-Cookie',ssid) 
        else: 
            sid = self.session_id 

        data = myuser.all().filter('session_id = ', sid).get() 
        return data 

    def _fetch_user_with_pass(self,u,p): 
        tmp = myuser.get_by_key_name(u.lower()) 
        if not tmp: return None 
        if tmp.password != p: return None 
        if tmp.active == False: return None 
        return tmp 

class Login(webapp2.RequestHandler): 
    def get(self): 
        user = session(self).get_current_user() 
        if user: 
            self.redirect('/')
        else:
            variables = {} 
            path = os.path.join(os.path.dirname(__file__), 'login.html') 
            self.response.out.write(template.render(path, variables)) 

    def post(self): 
        u = self.request.get('user') 
        p = self.request.get('pass') 
        tmp = session(self).grab_login(u,p) 

        if not tmp: 
            msg = u'Неверное имя пользователя или пароль.' 
            variables = {'message' : msg} 
            path = os.path.join(os.path.dirname(__file__), 'login.html') 
            self.response.out.write(template.render(path,variables)) 
        else: 
            self.redirect('/') 

class DoLogout(webapp2.RequestHandler): 
    def get(self): 
        session(self).logout() 
        self.redirect('/login') 
