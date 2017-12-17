# coding=UTF-8
'''
Created on 24.09.2017

@author: sysoev
'''
import webapp2
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext.webapp import template

import os
import data
import json
import datetime

import myusers
from google.appengine.api import users


def json_list(list, param_list):
    lst = []
    for pn in list:
        d = {'key': str(pn.key())}
        for param in param_list:
            d[param] = getattr(pn, param)
        lst.append(d)
    return json.dumps(lst, separators=(',', ':'))


class MainPage(webapp2.RequestHandler):
    def get(self):
        user = myusers.session(self).get_current_user()
        if (not user) and (not users.is_current_user_admin()):
            self.redirect('/login')
        else:
            template_values = {
                'userprojects': data.UserProject.all(),
                'projects': data.getUserProjects(user),
                'allprojects': data.Project.all(),
                'isAdmin': users.is_current_user_admin(),
                'users': myusers.MyUser.all(),
                # 'requests': data.getUserRequests()
            }
            path = os.path.join(os.path.dirname(__file__), 'project.html')
            self.response.out.write(template.render(path, template_values))


class AdminLogin(webapp2.RequestHandler):
    def get(self):
        if users.is_current_user_admin():
            self.redirect('/')
        else:
            login_page = users.create_login_url('/')
            self.redirect(login_page)


class CheckUserPassword(webapp2.RequestHandler):
    def get(self):
        user = myusers.session(self).get_current_user()
        user_pass = self.request.get('pass')
        db_pass = user.password
        self.response.out.write(str(user_pass == db_pass))
        return


class GetUserPassword(webapp2.RequestHandler):
    def get(self):
        key = self.request.get('key')
        self.response.out.write(myusers.getPassword(key))


class ObjectList(webapp2.RequestHandler):
    def get(self):
        object = self.request.get('object')
        if object == 'user':
            if not users.is_current_user_admin():
                self.error(400)
                return
            self.response.out.write(json_list(myusers.MyUser.all(), ['fullname', 'name', 'email', 'active']))
            return

        self.response.out.write('ERROR: UNSUPPORTED OBJECT')


class ObjectAdd(webapp2.RequestHandler):
    def post(self):
        object_type = self.request.get("object_type")

        if object_type == "user":
            if not users.is_current_user_admin():
                self.error(400)
                return
            fullname = self.request.get('fullname')
            username = self.request.get('username')
            email = self.request.get('email')
            # self.response.out.write(username)
            # return
            chk = myusers.MyUser.all().filter("username = ", username).get()
            if chk:
                self.error(400)
                return
            else:
                key = myusers.session(self).create_user(fullname, email, username, username)
                self.response.out.write(str(key))
                return

        if object_type == 'project':
            if not users.is_current_user_admin():
                self.error(400)
                return
            project_name = self.request.get('name')
            key = data.addProject(project_name)
            self.response.out.write(str(key))
            return

        self.error(400)


class ObjectUpdate(webapp2.RequestHandler):
    def post(self):
        object_type = self.request.get("object_type")
        if object_type == "user":
            key = self.request.get('key')
            fullname = self.request.get('fullname')
            email = self.request.get('email')
            active = (self.request.get('active') == u"да")
            myusers.updateUser(key, fullname, email, active)
            self.response.out.write('OK')
            return
        if object_type == "project":
            key = self.request.get('key')
            name = self.request.get('name')
            data.updateProject(key, name)
            self.response.out.write('OK')
            return
        if object_type == "password":
            key = self.request.get('key')
            passw = self.request.get('pass')
            if not myusers.session(self).updatePassword(key, passw):
                self.error(400)
                return
            self.response.out.write('OK')
            return
    
        self.error(400)


class UpdateCurrUserPass(webapp2.RequestHandler):
    def get(self):
        user = myusers.session(self).get_current_user()
        passw = self.request.get('pass')
        user.password = passw
        user.put()
        self.response.out.write('OK')
        return


class AddUserProject(webapp2.RequestHandler):
    def get(self):
        user_name = self.request.get('user_name')
        project_key = self.request.get('project_key')
        res = data.addUserProject(user_name, project_key)
        if res is None:
            self.error(400)
        else:
            self.response.out.write(str(res))
        return


class DeleteUserProject(webapp2.RequestHandler):
    def get(self):
        user_key = self.request.get('user_key')
        project_key = self.request.get('project_key')
        res = data.deleteUserProject(user_key, project_key)
        if res is None:
            self.error(400)
            return
        self.response.out.write('OK')        

class RequestList(webapp2.RequestHandler):
    def get(self):
        name = self.request.get('name')
        key = self.request.get('project_key')
        requests = data.getRequests(key)
        variables = {'page_name': name,
                     'requests': requests}
        # variables = {}
        path = os.path.join(os.path.dirname(__file__), 'request.html')
        # print(name)
        # print("asdasdasd")
        self.response.out.write(template.render(path, variables))

    def post(self):
        name = self.request.get('name')
        variables = {'page_name': name}
        path = os.path.join(os.path.dirname(__file__), 'request.html')
        # print(name)
        # print("asdasdasd")
        self.response.out.write(template.render(path, variables))


class AddRequest(webapp2.RequestHandler):
    def get(self):
        user_name = self.request.get('user_name')
        project_key = self.request.get('project_key')
        res = data.addUserProject(user_name, project_key)
        if res is None:
            self.error(400)
        else:
            self.response.out.write(str(res))
            return

application = webapp2.WSGIApplication([('/', MainPage),
                                       ('/login', myusers.Login),
                                       ('/logout', myusers.DoLogout),
                                       ('/admin', AdminLogin),
                                       ('/object_add/', ObjectAdd),
                                       ('/object_list/', ObjectList),
                                       ('/object_update/', ObjectUpdate),
                                       ('/check_user_password/', CheckUserPassword),
                                       ('/get_user_password/', GetUserPassword),
                                       ('/update_curr_user_pass/', UpdateCurrUserPass),
                                       ('/add_user_project/', AddUserProject),
                                       ('/delete_user_project/', DeleteUserProject),
                                       ('/request_for_project/', RequestList),
                                       ('/add_request/', AddRequest)],
                                      debug=True)
