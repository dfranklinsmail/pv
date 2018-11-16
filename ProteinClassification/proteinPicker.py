
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
    def findNextProtein(self, path) :
        self.getKnownProteins()
        print 'length ', len(self.knownProteins)
        files = os.listdir(path)
    
        folderProteins = []
        for file in files:
            if file.endswith('.png') :
                folderProteins.append(file[:4])

        for kp in self.knownProteins :
            if kp not in folderProteins :
                return kp

        return ''



    def savePNG(self, proteinName, path, data) :
        #save the data to a file
        logging.info('Saving %s, protein to folder: %s', proteinName, path)
        
        dataFile = proteinName+'.png'
        data = data[len('data:image/png;base64,'):]

        with open(path+dataFile, 'wb') as f:
            #f.write(base64.decodestring(data))
            f.write(data.decode('base64'))

    def getKnownProteins(self) :

        if len(self.knownProteins) == 0:
            with open(os.path.join(os.path.dirname(__file__), '25PDB.csv')) as csv_file:
                csv_reader = csv.reader(csv_file, delimiter=',')
                line_count = 0
                for row in csv_reader:
                    if line_count == 0:
                        line_count = 1
                    else:
                        protein = row[0]
                        if protein.endswith('_') or len(protein) <= 4:
                            protein = protein[0:4]
                            structuralClass = row[3]
                            self.knownProteins[protein] = row[3]
        
        return self.knownProteins