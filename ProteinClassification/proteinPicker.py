
import os
import logging
import base64
import csv

# class will iterate over the 25pdb file and find a protein that is not
# in the given folder
class ProteinPicker():
    def __init__(self):
        self.knownProteins = {}
    """
        Most proteins have a corrisponding fasta file url on the 
        site https://www.rcsb.org/ protein data bank.
        This method will find one protein in the 25pdb file that is
        not in the given folder path, and find its corrisponding url.
    """

    def findNextProtein(self, dirname) :
        print('in find next protein')
        self.getKnownProteins()
        #print 'length ', len(self.knownProteins)
        files = os.listdir(dirname)
    
        folderProteins = []
        for file in files:
            if file.endswith('.png') :
                print(file[:len(file)-4])
                folderProteins.append(file[:len(file)-4])

        for kp in self.knownProteins :
            proteinName = kp.__str__()
            if proteinName not in folderProteins :
                print(proteinName)
                return kp.name()

        return ''



    def savePNG(self, proteinName, path, data) :
        #save the data to a file
        print('Saving {}, protein to folder: {}'.format(proteinName, path))
        
        dataFile = proteinName+'.png'
        data = data[len('data:image/png;base64,'):]

        with open(path+dataFile, 'wb') as f:
            f.write(base64.decodestring(data))
            #f.write(data.decode('base64'))

    def getKnownProteins(self) :

        if len(self.knownProteins) == 0:
            with open(os.path.join(os.path.dirname(__file__), '25PDB.csv')) as csv_file:
                csv_reader = csv.reader(csv_file, delimiter=',')
                line_count = 0
                for row in csv_reader:
                    if line_count == 0:
                        line_count = 1
                    else:
                        protein = Protein(row[0])
                        print('the protein is ')
                        print(protein)
                        
                        #set the classification for this protein
                        self.knownProteins[protein] = row[3] 
        
        print('returning known proteins')
        return self.knownProteins



class Protein():
    def __init__(self, encodedProtein):
        #extract the protein's name
        self.protein = encodedProtein[0:4]
        self.chain = encodedProtein[4:5]
        if len(encodedProtein) > 5:
            chainSegment = encodedProtein[6:].replace('-', ' ').split(' ')
            self.chainSegmentStart = chainSegment[0]
            self.chainSegmentEnd = chainSegment[1]
        
    def __str__(self):
        toString = self.protein
        if self.chain != "_":
            toString += self.chain
        if hasattr(self, 'chainSegmentEnd'):
            toString += "-"+self.chainSegmentStart + "-" + self.chainSegmentEnd 
        return toString

    def __repr__(self):
        return "Protein"

    def name(self):
        return self.__str__().encode()