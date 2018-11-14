import sys
import numpy as np
import cv2 as cv
#pip install webcolors
#import webcolors


class Colors:
    def __init__(self, ra,ga,ba,na):
        self.r = ra
        self.g = ga
        self.b = ba
        self.name = na
COLORS = {
    Colors(0,0,0,'black'),



    Colors(255,255,255, 'white'),
    Colors(245,245,220, 'beige'),


    Colors(255,0,0, 'red'),
    Colors(139,0,0, 'red'),
    Colors(220,20,60, 'red'),
    Colors(255,69,0 , 'red'),
    Colors(128,0,0, 'red'),
    Colors(255,140,0, 'orange'),



    Colors(0,255,0, 'green'),
    Colors(154,205,50, 'green'),
    Colors(124,252,0, 'green'),
    Colors(0,100,0, 'green'),
    Colors(34,139,34, 'green'),
    Colors(20,205,50, 'green'),
    Colors(0,128,0, 'green'),



    Colors(0,0,255, 'blue'),
    Colors(0,0,128, 'blue'),
    Colors(0,0,140, 'blue'),
    Colors(0,0,205, 'blue'),
    Colors(30,144,255, 'blue'),


    Colors(255,255,0, 'yellow'),
    Colors(255,215,0, 'yellow'),



    Colors(0,255,255, 'cyan'),
    Colors(0,206,209, 'cyan'),
    Colors(72,209,204, 'cyan'),
    Colors(127,255,212, 'cyan'),


    Colors(138,43,226, 'purple'),
    Colors(75,0,130, 'purple'),
    Colors(106,90,205, 'purple'),
    Colors(123,104,238, 'purple'),
    Colors(148,0,211, 'purple'),

    Colors(255,0,255, 'magenta'),
    Colors(139,0,139, 'magenta'),

    Colors(255,192,203, 'pink'),
    Colors(255,182,193, 'pink'),



    Colors(192,192,192, 'gray'),


    Colors(128,128,128, 'gray'),
    Colors(112,128,144, 'gray'),
    Colors(119,136,153, 'gray'),
    Colors(105,105,105, 'gray'),

    Colors(128,128,0, 'olive'),
    Colors(128,0,128, 'purple'),
    Colors(0,128,128, 'teal'),
    Colors(139,69,19, 'brown'),
    Colors(165,42,42, 'brown'),
    Colors(160,82,45, 'brown')
    }



def get_colour_name(requested_colour):
    min_colours = {}
    for key, name in webcolors.css21_hex_to_names.items():
        r_c, g_c, b_c = webcolors.hex_to_rgb(key)
        rd = (r_c - requested_colour[0]) ** 2
        gd = (g_c - requested_colour[1]) ** 2
        bd = (b_c - requested_colour[2]) ** 2
        min_colours[(rd + gd + bd)] = name
    return min_colours[min(min_colours.keys())]

def get_color_name(col):
    min_col = {}
    for c in COLORS:
        rd = (c.r - col[0]) ** 2
        gd = (c.g - col[1]) ** 2
        bd = (c.b - col[2]) ** 2
        min_col[ (rd + gd + bd) ] = c.name

    return min_col[ min(min_col.keys())]


def check(argv):
    for a in argv:
        print(a)
        filename = a
        #img = cv.imread(filename, cv.IMREAD_GRAYSCALE)
        img = cv.imread(filename)
        if img is None:
            print('Cannot open image: ', filename)
            return 0

        height, width = img.shape[:2]
        splitFilename = filename.split('.')
        outputFilename = splitFilename[0] + '_output.' + splitFilename[1].lower()
        #check = cv.resize(img,None, fx = 0.9, fy = 0.9, interpolation = cv.INTER_LINEAR)

        #watershed
        gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)

        ret,thresh = cv.threshold(gray,0,255,cv.THRESH_BINARY+cv.THRESH_OTSU)
        fg = cv.erode(thresh,None,iterations = 8)
        bgt = cv.dilate(thresh,None,iterations = 8)
        ret,bg = cv.threshold(bgt,1,128,1)
        marker = cv.add(fg,bg)
        marker32 = np.int32(marker)
        cv.watershed(img,marker32)
        m = cv.convertScaleAbs(marker32)
        ret,thresh = cv.threshold(m,0,255,cv.THRESH_BINARY+cv.THRESH_OTSU)
        img = cv.bitwise_and(img,img,mask = thresh)



        #kmeans
        z = img.reshape((-1,3))
        z = np.float32(z)

        criteria = (cv.TERM_CRITERIA_EPS + cv.TERM_CRITERIA_MAX_ITER, 10,1.0)
        k=3
        ret,label,center = cv.kmeans(z,k, None, criteria,10, cv.KMEANS_RANDOM_CENTERS)
        center = np.uint8(center)
        #print(center)
        res = center[label.flatten()]
        res2 = res.reshape((img.shape))
        label = label.reshape(img.shape[0], img.shape[1])


        y = res2.shape[0]//6
        yMax = y * 5
        condition = True
        while condition and (y < yMax) :
            listLabel = []
            for x in range(res2.shape[1]):
                listLength = len(listLabel)
                if listLength != 0:

                    if listLabel[listLength - 1] != label[y,x]:
                        listLabel.append( label[y,x] )


                else:
                    listLabel.append(label[y,x])
            if len(listLabel) == 5:
                #print(listLabel)
                if(listLabel[0] == listLabel[4]) and (listLabel[1] == listLabel[3]) and (listLabel[2] != listLabel[3] ) and ( listLabel[2] != listLabel[4]):
                    textRGB = center[listLabel[2]][::-1]
                    textColor = get_color_name( textRGB )
                    shapeRGB = center[listLabel[3]][::-1]
                    shapeColor = get_color_name( shapeRGB )
                    print(textColor)
                    print(textRGB)
                    print(shapeColor)
                    print(shapeRGB)

                    condition = False





            y += 1;











        cv.imwrite(outputFilename, res2)



        #accessing
        #blue = img[y,x,0]
        #green = img[y,x,1]
        #red = img[y,x,2]


        #selecting a region of interest
        #smallImg = img[10:110, 10:110]

        #conversion
        #grey = cv.cvtColor(img, cv.COLOR_BGR2GRAY)

        #change image type from 8UC1  to 32FC1
        #dst = src.astype(np.float32)



        #outputting file
        #cv.imwrite(outputFilename , dst)

        #showing image
        #cv.namedWindow('image', cv.WINDOW_AUTOSIZE)
        #cv.imshow('image', dst)
        #cv.waitKey()
    return 0


#if __name__ == "__main__":
#    print(get_color_name((129,213,221)))
check(sys.argv[1:])