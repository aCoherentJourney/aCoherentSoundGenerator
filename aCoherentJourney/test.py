import sys
import numpy as np


def getInputData(inputFile):
    data = np.genfromtxt(inputFile, delimiter = ",")
    dataLength = len(data)
    print(dataLength)
    return dataLength


getInputData(sys.argv[1])




