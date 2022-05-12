import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class posts1652137696314 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'posts',
                columns: [
                    {
                        name:'id',
                        type: 'uuid',
                        isPrimary:true
                    },
                    {
                        name: 'postDescription',
                        type: 'varchar',
                    },
                    {
                        name: 'imgUrl',
                        type: 'varchar'
                    },
                    {
                        name: 'isActive',
                        type: 'boolean'
                    }, 
                    {
                        name: 'userId',
                        type: 'uuid'
                    },  
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()'
                    }
                ],
                foreignKeys: [
                    {
                      name: 'FKUserPost',
                      referencedTableName: 'users',
                      referencedColumnNames: ['id'],
                      columnNames: ['userId'],
                      onDelete: 'SET NULL',
                      onUpdate: 'SET NULL',
                    },
                  ],
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('posts')
    }

}
