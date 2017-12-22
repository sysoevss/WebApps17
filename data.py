# coding=UTF-8
'''
Created on 24.09.2017

@author: sysoev
'''
from google.appengine.ext import db
from google.appengine.api import users

import datetime
import time
import logging

from myusers import MyUser


def force_unicode(string):
    if type(string) == unicode:
        return string
    return string.decode('utf-8')


class Project(db.Model):
    name = db.StringProperty(multiline=False)

def getProjectsList(user):
    return None


def updateProject(key, name):
    p = Project.get(key)
    if not p:
        return
    p.name = name
    p.put()


def addProject(name):
    p = Project()
    p.name = name
    p.put()
    return p.key()


class UserProject(db.Model):
    user_key = db.ReferenceProperty(MyUser)
    project_key = db.ReferenceProperty(Project)
    number = 0


def addUserProject(user_name, project_key_str):
    user_query = MyUser.all()
    user = user_query.filter('username = ', user_name).get()
    if user is None:
        return None

    true_project_key = Project.get(project_key_str).key()
    if check_user_have_project(user, true_project_key):
        return False

    up = UserProject()
    up.user_key = user.key()
    up.project_key = true_project_key
    up.put()
    return True


def check_user_have_project(user, true_project_key):
    user_project_keys = [user_proj.project_key.key() for user_proj in
                         UserProject.all().filter('user_key = ', user.key()).fetch(None)]

    return true_project_key in user_project_keys


def deleteUserProject(user_key, project_key):
    query = UserProject.all()
    query.filter('user_key = ', MyUser.get(user_key)).filter('project_key = ', Project.get(project_key))
    user_project = query.get()
    if user_project is None:
        return None
    # project.key().delete()
    db.delete(user_project.key())
    return True


def getUserProjects(user):
    if user is None:
        return []
    query = UserProject.all().filter('user_key = ', user.key())
    return [user_project.project_key for user_project in query]
    # return [Project.get(user_project.project_key) for user_project in query]

class Request(db.Model):
    number = int
    name = db.StringProperty()
    description = db.StringProperty(multiline=True)
    state = int
    perfomer = db.ReferenceProperty()  #???

def addRequests(project_key, name, description):
    print("log")
    req = Request(parent=project_key)
    req.name = name
    req.description = description
    req.perfomer = ""
    req.state = 1
    req.number = Request(ancestor = project_key).all().length + 1
    req.put()

    Project.set(project_key).number += 1
    return True

def getRequests(project_key):
    if project_key is None:
        return []
    query = Request(ancestor = project_key).all()
    return query