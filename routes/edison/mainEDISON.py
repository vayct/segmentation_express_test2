import numpy as np
import cv2 as cv
import sys
from subprocess import call



programPath = sys.argv[6]
inputFilename = sys.argv[1]
outputFilename = sys.argv[2]

spatialBandwidth = sys.argv[3]
rangeBandwidth = sys.argv[4]
minRegion = sys.argv[5]


#converting the input image to PPM format
img = cv.imread(inputFilename)
params = []
params.append(cv.IMWRITE_PXM_BINARY)
params.append(1)
inputFilenameSplit = inputFilename.split('.')
inputFilenamePPM = inputFilenameSplit[0] + '.ppm'
cv.imwrite(inputFilenamePPM,img, params)


#writing the configuration EDISON file
edsName = inputFilenameSplit[0] + '.eds'
edsSegmImage = 'segmimage.pnm'
edsFiltImage = 'filtimage.ppm'
edsBndyImage = 'bndyimage.pgm'
with open(edsName, 'w') as file:

    #Specify mean shift parameters
    file.write  ("SpatialBandwidth = " + spatialBandwidth + ";\n")
    file.write  ("RangeBandwidth = " + rangeBandwidth +";\n")
    file.write  ("MinimumRegionArea = " + minRegion +";\n")
    file.write  ("Speedup = HIGH;\n")

    #Display progress
    file.write ("DisplayProgress OFF;\n")

    #Load an image to be segmented
    file.write  ("Load('" + inputFilenamePPM +"', IMAGE);\n")

    #Segment the image
    file.write  ("Segment;\n")

    #Save the result:

    #Output the segmented images
    file.write  ("Save('" + edsSegmImage + "', PNM, SEGM_IMAGE);\n")

    #Output the filtered image
    file.write  ("Save('" + edsFiltImage + "', PPM, FILT_IMAGE);\n")

    #Output the region boundaries of a segmented or filtered image
    file.write ("Save('" + edsBndyImage + "', PGM, SEGM_BOUNDARIES);\n")

print("FINISHED")

edsProcessInput = []
edsProcessInput.append(programPath)
edsProcessInput.append(edsName)

call(edsProcessInput)
outputImage = cv.imread(edsBndyImage)
cv.imwrite(outputFilename, outputImage)
#convert back to original image

