
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
        knownProteins = self.getKnownProteins()
        print('known proteins count {}'.format(len(knownProteins)))
        #print 'length ', len(self.knownProteins)
        foundProteins = self.getFolderProteins(dirname)
        print('found proteins count {}'.format(len(foundProteins)))
        
        # find the first protein from the known 25pdb file
        # that is not in the already imaged folder proteins
        for proteinName in knownProteins.keys() :
            # proteinName = kp.__str__()
            if proteinName not in foundProteins :
                print(proteinName)
                #return kp.name()
                return proteinName

        return ''

    def getFolderProteins(self, dirname) :
        if len(self.folderProteins) == 0 :
            for folder in self.classificationToFolderName.values() :
                files = os.listdir(dirname+folder)
                for file in files:
                    if file.endswith('.png') :
                        name = file[:-4]
                        name = name.replace(':', '-')
                        name = name.replace('_', '')
                        self.folderProteins.append(name)

        return self.folderProteins


    def savePNG(self, proteinName, path, data) :
        #save the data to a file
        
        folderName = self.getClassFolderName(proteinName)
        dataFile = proteinName+'.png'
        data = data[len('data:image/png;base64,'):]

        print('Saving {}, protein to folder: {}'.format(proteinName, path+folderName))
        with open(path+folderName+'/'+dataFile, 'wb') as f:
            f.write(base64.decodestring(data))
        self.folderProteins.append(proteinName)

    def getClassFolderName(self, proteinName) :  
        if len(self.knownProteins) == 0 :
            self.getKnownProteins()
        
        folderName = ''
        if proteinName in self.knownProteins :
            folderName = self.classificationToFolderName[self.knownProteins[proteinName]]
        
        return folderName

    def getKnownProteins(self) :

        if len(self.knownProteins) == 0 :
            with open(os.path.join(os.path.dirname(__file__), '25PDB.csv')) as csv_file:
                csv_reader = csv.reader(csv_file, delimiter=',')
                line_count = 0
                for row in csv_reader :
                    if line_count == 0:
                        line_count = 1
                    else :
                        #set the classification for this protein
                        proteinName = row[0]
                        proteinName = proteinName.replace(':', '-')
                        proteinName = proteinName.replace('_', '')
                        self.knownProteins[proteinName] = row[3] 
        
        return self.knownProteins