# Study-02/eel-ros1の実験
## 数値型パラメータのR/W

このExampleは、数値型ROSパラメータ⇔HTMLの相互アクセスの評価をするものです。  
ROSパラメータ */solver/doBin* を4つのDOMエレメントから参照しています。同じパラメータを参照しているため、ひとつのエレメントで行った変更は、他のエレメントにも即時に反映されます。

1. 起動  
このディレクトリにて
~~~
roslaunch panel.launch
~~~
2. HTML/eelの起動  
~~~
python main.py
~~~

