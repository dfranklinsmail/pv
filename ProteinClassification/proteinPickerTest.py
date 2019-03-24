import unittest
from proteinPicker import ProteinPicker
import os

class MyTest(unittest.TestCase):
    def nottest(self):
        proteinPicker = ProteinPicker()
        path = '/Users/sircrashalot/Documents/school/thesis/proteins/'
        nextProtein = proteinPicker.findNextProtein(path)
        print(nextProtein)

    # def test(self) :
    #     print('hello world')
    #     proteinPicker = ProteinPicker()
    #     path = '/Users/sircrashalot/Documents/school/thesis/proteins/'
    #     for protein in proteinPicker.getFolderProteins(path) :
    #         folderName = proteinPicker.getClassFolderName(protein[:-4])
    #         if len(folderName) > 0 :
    #             os.rename(path+protein, path+folderName+'/'+protein)

    def testXLS(self):
        print('testing xls file reading')
        proteinPicker = ProteinPicker()
        proteins = proteinPicker.getKnownProteinsXLS()
        for p in proteins.keys():
            print('the protein is {} with class {}'.format(p, proteins[p]))
if __name__ == '__main__':
    unittest.main()