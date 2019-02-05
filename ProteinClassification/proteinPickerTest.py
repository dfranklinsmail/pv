import unittest
from proteinPicker import ProteinPicker
import os

class MyTest(unittest.TestCase):
    def test(self):
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

        

if __name__ == '__main__':
    unittest.main()