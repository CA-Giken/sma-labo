#!/usr/bin/env python3

import cv2
import rospy
import tf2_ros
import numpy as np
from geometry_msgs.msg import TransformStamped
from sensor_msgs.msg import Image
from sensor_msgs.msg import CameraInfo
import ros_numpy
from cv_bridge import CvBridge, CvBridgeError
from scipy.spatial.transform import Rotation as R
from smabo import tflib
import penta_solver as solver

Config={
  "base_frame_id":"camera",
  "frame_id":"penta_board",
}

def cb_img(msg):
  try:
    imc=bridge.imgmsg_to_cv2(msg,"bgr8")
  except CvBridgeError as e:
    print("Error in cv_bridge",e)
  else:
    cTt,err,img=solver.solve(imc)
    if err>=0:
      tfs=TransformStamped()
      tfs.header.stamp=rospy.Time.now()
      tfs.header.frame_id=Config["base_frame_id"]
      tfs.child_frame_id=Config["frame_id"]
      tfs.transform=tflib.fromRT(cTt)
      pub_tfs.publish(tfs)
      pub_ctf.publish(tfs)
    try:
      msg=bridge.cv2_to_imgmsg(img, "bgr8")
      pub_img.publish(msg)
    except CvBridgeError as e:
      print("Error in cv_bridge",e)

def cb_info(msg):
  solver.Kmat=np.array(msg.K).reshape((3,3))
  pass

if __name__=="__main__":
  rospy.init_node("penta_detector")
  ###Load Config
  try:
    Config.update(rospy.get_param("~config"))
  except Exception as e:
    print("get_param exception:",e.args)

  rospy.Subscriber("~imsub",Image,cb_img)
  rospy.Subscriber("~info",CameraInfo,cb_info)
  pub_img=rospy.Publisher('~impub',Image,queue_size=1);
  pub_tfs=rospy.Publisher('~tfs',TransformStamped,queue_size=1);
  pub_ctf=rospy.Publisher('/update/config_tf',TransformStamped,queue_size=1);
  bridge=CvBridge()

  rospy.spin()
