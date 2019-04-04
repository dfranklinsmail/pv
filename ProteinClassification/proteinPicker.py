
import os
import logging
import base64
import csv

# class will iterate over the 25pdb file and find a protein that is not
# in the given folder
class ProteinPicker():
    def __init__(self):
        self.knownProteins = {}
        self.folderProteins = []
        self.classificationToFolderName = {}
        self.classificationToFolderName['a'] = 'allalpha'
        self.classificationToFolderName['b'] = 'allbeta'
        self.classificationToFolderName['c'] = 'mixedalphabeta'
        self.classificationToFolderName['d'] = 'segregatedalphabeta'
    """
        Most proteins have a corrisponding fasta file url on the 
        site https://www.rcsb.org/ protein data bank.
        This method will find one protein in the 25pdb file that is
        not in the given folder path, and find its corrisponding url.
    """

    def findNextProtein(self, dirname) :
        print('in find next protein')
        
        #for the 25pdb file
        #knownProteins = self.getKnownProteins()
        #for an D1185 or D8244 file
        knownProteins = self.getKnownProteinsXLS()
        print('known proteins count {}'.format(len(knownProteins)))
        #print 'length ', len(self.knownProteins)
        folderProteins = self.getFolderProteins(dirname)
        print('folder proteins count {}'.format(len(folderProteins)))
        
        # find the first protein from the known 25pdb file
        # that is not in the already imaged folder proteins
        for proteinName in knownProteins.keys() :
            # proteinName = kp.__str__()
            if proteinName not in folderProteins :
                print(proteinName)
                #return kp.name()
                return proteinName

        return ''

    def getFolderProteins(self, dirname) :
        print('finding folder proteins')
        if len(self.folderProteins) == 0 :
            for folder in self.classificationToFolderName.values() :
                files = os.listdir(dirname+folder)

                for file in files:
                    if file.endswith('.png') :
                        name = file[:-5]
                        name = name.replace(':', '-')
                        name = name.replace('_', '')
                        self.folderProteins.append(name)
                        print(name)
        return self.folderProteins


    def savePNG(self, proteinName, path, data) :
        #save the data to a file
        
        folderName = self.getClassFolderName(proteinName)
        dataFile = proteinName
        data = data[len('data:image/png;base64,'):]

        filename = self.makeFilename(path+folderName+'/', dataFile, 1)
       
        with open(filename, 'wb') as f:
            f.write(base64.decodestring(data))
        self.folderProteins.append(proteinName)

    def makeFilename(self, folder, proteinName, index):
            filename = folder + proteinName + str(index) + '.png'
            if (os.path.exists(filename)):
                index=index+1
                filename = self.makeFilename(folder, proteinName, index)
            return filename
    
    def getClassFolderName(self, proteinName) :  
        if len(self.knownProteins) == 0 :
            self.getKnownProteins()
        
        folderName = ''
        if proteinName in self.knownProteins :
            folderName = self.classificationToFolderName[self.knownProteins[proteinName]]
            print("the protein {} is a '{}' class with foldername {}".format(proteinName, self.knownProteins[proteinName], folderName))
        
        return folderName

    def getKnownProteinsXLS(self):
        if len(self.knownProteins) == 0 :
            with open(os.path.join(os.path.dirname(__file__), 'D8244-scop40_v1.73.csv')) as csv_file:
                csv_reader = csv.reader(csv_file, delimiter=',')
                line_count = 0
                for row in csv_reader :
                    if line_count == 0:
                        line_count = 1
                    #elif row[3] == 'b' :
                    #set the classification for this protein
                    else :
                        proteinName = row[1]+row[3]
                        proteinName = proteinName.replace(':', '-')
                        if proteinName.endswith('-'):
                            proteinName = proteinName[:-1]
                        #proteinName = proteinName.replace('_', '')
                        self.knownProteins[proteinName] = self.convertClassName(row[2])
                        #print("protein name {} has class {}".format(proteinName, row[3]))
        
        return self.knownProteins

    def convertClassName(self, fullClassName):
        if fullClassName == 'all-a':
            return 'a'
        elif fullClassName == 'all-b':
            return 'b'
        elif fullClassName == 'a/b':
            return 'c'
        elif fullClassName == 'a+b':
            return 'd'
    def getKnownProteins(self) :

        if len(self.knownProteins) == 0 :
            with open(os.path.join(os.path.dirname(__file__), '25PDB.csv')) as csv_file:
                csv_reader = csv.reader(csv_file, delimiter=',')
                line_count = 0
                for row in csv_reader :
                    if line_count == 0:
                        line_count = 1
                    #elif row[3] == 'b' :
                    #set the classification for this protein
                    else :
                        proteinName = row[0]
                        proteinName = proteinName.replace(':', '-')
                        proteinName = proteinName.replace('_', '')
                        self.knownProteins[proteinName] = row[3]
                        #print("protein name {} has class {}".format(proteinName, row[3]))
        
        return self.knownProteins