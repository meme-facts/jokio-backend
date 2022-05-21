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
                        name: 'img_url',
                        type: 'varchar'
                    },
                    {
                        name: 'isActive',
                        type: 'boolean'
                    }, 
                    {
                        name: 'user_id',
                        type: 'uuid'
                    },  
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()'
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()'
                    }
                ],
                foreignKeys: [
                    {
                      name: 'FKUserPost',
                      referencedTableName: 'users',
                      referencedColumnNames: ['id'],
                      columnNames: ['user_id'],
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
