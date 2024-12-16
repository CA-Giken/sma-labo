import eel
import rospy

@eel.expose
def log(msg):
  print(msg)

@eel.expose
def set_param(name,val):
  print("eel::set_param",name,val)
  rospy.set_param(name,val)
  return

@eel.expose
def get_param(name):
  print("eel::get_param",name)
  try:
    return rospy.get_param(name)
  except Exception as e:
    print("eel::get_param::Exception",e)
    return None


rospy.init_node("eel_ros1",anonymous=True)
rospy.sleep(1)

eel.init('web')
eel.start('sample.html', block=False, size=(1000,700))

while True:
  eel.sleep(0.5)

